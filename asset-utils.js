const fs = require("fs");
const path = require("path");

const ASSET_EXT_RE = /\.(?:png|jpe?g|webp|gif|svg|ico|mp4|webm)(?:[?#].*)?$/i;
const GENERIC_PLACEHOLDER_NAMES = new Set(["image.png", "asset.jpg", "uploaded-image.jpg"]);
const LOCAL_FILE_RE = /^file:\/\/\/?/i;
const DATA_URL_RE = /^data:([^;,]+)(?:;[^,]*)?,(.+)$/i;
const EXTERNAL_RE = /^(?:https?:)?\/\//i;
const BLOB_RE = /^blob:/i;
const WINDOWS_ABS_RE = /^[a-z]:[\\/]/i;

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function stripQuery(value) {
  return String(value || "").split(/[?#]/)[0];
}

function isAssetLike(value) {
  const text = String(value || "").trim();
  if (!text || GENERIC_PLACEHOLDER_NAMES.has(stripQuery(text))) return false;
  return ASSET_EXT_RE.test(stripQuery(text)) || DATA_URL_RE.test(text) || BLOB_RE.test(text) || LOCAL_FILE_RE.test(text);
}

function imageSrc(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.src || "";
  }
  return typeof value === "string" ? value : "";
}

function isExternalPath(value) {
  return EXTERNAL_RE.test(String(value || ""));
}

function isBlockedRuntimePath(value) {
  const text = String(value || "").trim();
  return BLOB_RE.test(text) || LOCAL_FILE_RE.test(text);
}

function isAbsolutePath(value) {
  const text = String(value || "").trim();
  return WINDOWS_ABS_RE.test(text) || path.isAbsolute(text);
}

function normalizeRelativePath(value) {
  const text = toPosix(String(value || "").trim());
  return text.replace(/^\.\/+/, "").replace(/^\/+/, "");
}

function isProjectRelativePath(value) {
  const text = String(value || "").trim();
  if (!text || isExternalPath(text) || isBlockedRuntimePath(text) || DATA_URL_RE.test(text) || isAbsolutePath(text)) {
    return false;
  }
  return normalizeRelativePath(text).startsWith("lv_assets/");
}

function resolveProjectPath(projectRoot, relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const resolved = path.resolve(projectRoot, normalized);
  const root = path.resolve(projectRoot);
  if (!resolved.toLowerCase().startsWith(root.toLowerCase() + path.sep.toLowerCase()) && resolved.toLowerCase() !== root.toLowerCase()) {
    return null;
  }
  return resolved;
}

function projectFileExists(projectRoot, relativePath) {
  const filePath = resolveProjectPath(projectRoot, relativePath);
  return !!filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function safeFileName(name, fallbackExt) {
  const parsed = path.parse(String(name || "asset"));
  const ext = (parsed.ext || fallbackExt || ".jpg").toLowerCase().replace(/[^.\w]/g, "") || ".jpg";
  const base = (parsed.name || "asset")
    .replace(/[^\w\-\u4e00-\u9fff ]+/g, "_")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "asset";
  return base + ext;
}

function uniqueTargetPath(projectRoot, targetDir, originalName) {
  const safeDir = normalizeRelativePath(targetDir || "lv_assets/uploads");
  const absoluteDir = resolveProjectPath(projectRoot, safeDir);
  if (!absoluteDir || !safeDir.startsWith("lv_assets/")) {
    throw new Error("Invalid asset target directory: " + targetDir);
  }
  fs.mkdirSync(absoluteDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  let fileName = stamp + "-" + safeFileName(originalName);
  let target = path.join(absoluteDir, fileName);
  let counter = 1;
  while (fs.existsSync(target)) {
    const parsed = path.parse(fileName);
    target = path.join(absoluteDir, parsed.name + "-" + counter + parsed.ext);
    counter += 1;
  }
  return {
    absolute: target,
    relative: toPosix(path.relative(projectRoot, target)),
  };
}

function sourcePathFromFileUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return decodeURIComponent(url.pathname).replace(/^\/([a-z]:\/)/i, "$1");
  } catch (error) {
    return "";
  }
}

function copyLocalAssetIntoProject(projectRoot, source, targetDir) {
  const raw = String(source || "").trim();
  const sourcePath = LOCAL_FILE_RE.test(raw) ? sourcePathFromFileUrl(raw) : raw;
  if (!sourcePath || !fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    return null;
  }
  const target = uniqueTargetPath(projectRoot, targetDir, path.basename(sourcePath));
  fs.copyFileSync(sourcePath, target.absolute);
  return target.relative;
}

function writeDataUrlAsset(projectRoot, dataUrl, targetDir, nameHint) {
  const match = String(dataUrl || "").match(DATA_URL_RE);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const ext = mime.includes("png") ? ".png" : mime.includes("webp") ? ".webp" : mime.includes("gif") ? ".gif" : mime.includes("svg") ? ".svg" : ".jpg";
  const target = uniqueTargetPath(projectRoot, targetDir, safeFileName(nameHint || "uploaded-image", ext));
  fs.writeFileSync(target.absolute, Buffer.from(match[2], "base64"));
  return target.relative;
}

function shouldInspectKey(key) {
  return /^(?:src|poster|image|images|gallery|thumbnail|thumb|mainImage|detailImages|modelCards|slices|staticImages)$/i.test(String(key || ""));
}

function collectConfigAssetRefs(value, options = {}) {
  const refs = [];
  const pathParts = options.pathParts || [];
  const parentKey = options.parentKey || "";

  function visit(node, parts, key) {
    if (typeof node === "string") {
      if (isAssetLike(node) || shouldInspectKey(key)) {
        refs.push({ source: options.source || "config", field: parts.join("."), path: node, kind: "config" });
      }
      return;
    }
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, parts.concat(String(index)), key));
      return;
    }
    Object.keys(node).forEach((childKey) => {
      if (shouldInspectKey(childKey) || shouldInspectKey(key) || typeof node[childKey] === "object") {
        visit(node[childKey], parts.concat(childKey), childKey);
      }
    });
  }

  visit(value, pathParts, parentKey);
  return refs.filter((ref) => isAssetLike(ref.path));
}

function getProductIdFromField(field) {
  const match = String(field || "").match(/productCatalog\.([^.\]]+)/);
  return match ? match[1] : "";
}

function productNameFor(config, productId) {
  if (!productId) return "";
  const products = config && config.secondary && Array.isArray(config.secondary.products) ? config.secondary.products : [];
  const found = products.find((item) => String(item && item.productId) === String(productId));
  return (found && (found.title || found.name)) || "";
}

function issueReason(type) {
  const reasons = {
    "data-url": "使用了未入库的 base64 图片数据",
    "blob-path": "使用了浏览器临时 blob 路径",
    "file-url": "使用了 file:/// 本机文件路径",
    "external-path": "引用了项目外部图片",
    "absolute-path": "使用了本机绝对路径",
    "non-project-relative-path": "不是项目内部 lv_assets 相对路径",
    "missing-file": "项目内找不到对应图片文件",
  };
  return reasons[type] || "图片资源路径无效";
}

function issueFix(type) {
  const fixes = {
    "data-url": "已尝试写入 ./lv_assets/uploads；如果仍失败，请重新上传该图片",
    "blob-path": "请重新通过控制器上传，blob 临时路径无法跨电脑保存",
    "file-url": "已尝试复制到 ./lv_assets/uploads；如果无法复制，请重新上传该图片",
    "external-path": "请把图片下载或上传进 ./lv_assets/uploads 后再保存",
    "absolute-path": "已尝试复制到 ./lv_assets/uploads；如果无法复制，请重新上传该图片",
    "non-project-relative-path": "请使用 ./lv_assets/uploads 或 ./lv_assets/products 下的相对路径",
    "missing-file": "请恢复该图片文件，或重新上传/替换为当前商品可用图片",
  };
  return fixes[type] || "请重新上传该图片并保存为项目内部相对路径";
}

function issueWithDetails(config, ref, type) {
  const productId = ref.productId || getProductIdFromField(ref.field);
  return Object.assign({}, ref, {
    productId,
    productName: productNameFor(config, productId),
    type,
    reason: issueReason(type),
    fix: issueFix(type),
  });
}

function fallbackForProduct(config, productId) {
  const product = config && config.tertiary && config.tertiary.productCatalog && config.tertiary.productCatalog[productId];
  const detail = product && Array.isArray(product.detailImages) ? product.detailImages : [];
  const gallery = product && Array.isArray(product.gallery) ? product.gallery : [];
  const candidates = detail.concat(gallery.map((item) => item && (item.image || item.src || item)));
  const found = candidates.find((item) => item && (typeof item === "string" ? item : item.src));
  return found || "lv_assets/placeholder.svg";
}

function getPathValue(root, field) {
  return String(field || "").split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), root);
}

function setPathValue(root, field, value) {
  const parts = String(field || "").split(".");
  const last = parts.pop();
  const target = parts.reduce((obj, key) => (obj == null ? undefined : obj[key]), root);
  if (target && last != null) target[last] = value;
}

function replaceConfigPath(config, field, nextPath) {
  const current = getPathValue(config, field);
  if (current && typeof current === "object" && !Array.isArray(current)) {
    current.src = nextPath;
    current.isUploaded = true;
    return;
  }
  setPathValue(config, field, nextPath);
}

function validateAndRepairConfigAssets(config, options) {
  const projectRoot = options.projectRoot;
  const targetDir = options.targetDir || "lv_assets/uploads";
  const repair = !!options.repair;
  const refs = collectConfigAssetRefs(config, { source: "huan-config.js" });
  const issues = [];
  const fixes = [];

  refs.forEach((ref) => {
    const value = String(ref.path || "").trim();
    const productId = getProductIdFromField(ref.field);
    const base = { source: ref.source, field: ref.field, productId, productName: productNameFor(config, productId), path: value };

    if (DATA_URL_RE.test(value)) {
      if (repair) {
        const next = writeDataUrlAsset(projectRoot, value, targetDir, ref.field.replace(/[^\w-]+/g, "-"));
        if (next) {
          replaceConfigPath(config, ref.field, next);
          fixes.push(Object.assign({}, base, { action: "data-url-imported", next }));
          return;
        }
      }
      issues.push(issueWithDetails(config, base, "data-url"));
      return;
    }

    if (isBlockedRuntimePath(value)) {
      if (LOCAL_FILE_RE.test(value) && repair) {
        const next = copyLocalAssetIntoProject(projectRoot, value, targetDir);
        if (next) {
          replaceConfigPath(config, ref.field, next);
          fixes.push(Object.assign({}, base, { action: "file-url-imported", next }));
          return;
        }
      }
      issues.push(issueWithDetails(config, base, BLOB_RE.test(value) ? "blob-path" : "file-url"));
      return;
    }

    if (isExternalPath(value)) {
      issues.push(issueWithDetails(config, base, "external-path"));
      return;
    }

    if (isAbsolutePath(value)) {
      if (repair) {
        const next = copyLocalAssetIntoProject(projectRoot, value, targetDir);
        if (next) {
          replaceConfigPath(config, ref.field, next);
          fixes.push(Object.assign({}, base, { action: "absolute-path-imported", next }));
          return;
        }
      }
      issues.push(issueWithDetails(config, base, "absolute-path"));
      return;
    }

    const normalized = normalizeRelativePath(value);
    if (value !== normalized && repair) {
      replaceConfigPath(config, ref.field, normalized);
      fixes.push(Object.assign({}, base, { action: "normalized-relative-path", next: normalized }));
    }
    if (!isProjectRelativePath(normalized)) {
      issues.push(issueWithDetails(config, base, "non-project-relative-path"));
      return;
    }
    if (!projectFileExists(projectRoot, normalized)) {
      const fallback = fallbackForProduct(config, productId);
      const fallbackSrc = typeof fallback === "string" ? fallback : fallback && fallback.src;
      if (repair && fallbackSrc && projectFileExists(projectRoot, fallbackSrc)) {
        replaceConfigPath(config, ref.field, normalizeRelativePath(fallbackSrc));
        fixes.push(Object.assign({}, base, { action: "missing-replaced-with-product-fallback", next: normalizeRelativePath(fallbackSrc) }));
        return;
      }
      issues.push(issueWithDetails(config, base, "missing-file"));
    }
  });

  const counts = refs.reduce((acc, ref) => {
    const value = String(ref.path || "");
    acc.total += 1;
    if (projectFileExists(projectRoot, value)) acc.valid += 1;
    if (isAbsolutePath(value)) acc.absolute += 1;
    if (isExternalPath(value)) acc.external += 1;
    if (isBlockedRuntimePath(value)) acc.runtime += 1;
    return acc;
  }, { total: 0, valid: 0, absolute: 0, external: 0, runtime: 0 });

  return { refs, issues, fixes, counts };
}

function scanTextAssetRefs(text, source) {
  const refs = [];
  const patterns = [
    /\b(?:src|poster|href)=["']([^"']+)["']/gi,
    /url\(\s*["']?([^"')]+)["']?\s*\)/gi,
    /["']([^"']+\.(?:png|jpe?g|webp|gif|svg|ico|mp4|webm)(?:[?#][^"']*)?)["']/gi,
  ];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text))) {
      if (isAssetLike(match[1])) {
        refs.push({ source, field: "text", path: match[1], kind: "text" });
      }
    }
  });
  const seen = new Set();
  return refs.filter((ref) => {
    const key = ref.source + "|" + ref.path;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function checkRefs(projectRoot, refs) {
  const issues = [];
  const counts = { total: refs.length, valid: 0, missing: 0, absolute: 0, external: 0, runtime: 0 };
  refs.forEach((ref) => {
    const value = String(ref.path || "").trim();
    if (isAbsolutePath(value)) counts.absolute += 1;
    if (isExternalPath(value)) counts.external += 1;
    if (isBlockedRuntimePath(value)) counts.runtime += 1;
    if (isProjectRelativePath(value) && projectFileExists(projectRoot, value)) {
      counts.valid += 1;
      return;
    }
    if (isExternalPath(value)) {
      issues.push(Object.assign({}, ref, { type: "external-path", suggestion: "Copy/download into lv_assets/uploads and use a project-relative path." }));
      return;
    }
    if (isBlockedRuntimePath(value)) {
      issues.push(Object.assign({}, ref, { type: BLOB_RE.test(value) ? "blob-path" : "file-url", suggestion: "Upload through the controller so it is copied into lv_assets/uploads." }));
      return;
    }
    if (isAbsolutePath(value)) {
      issues.push(Object.assign({}, ref, { type: "absolute-path", suggestion: "Copy into lv_assets/uploads and replace with a relative path." }));
      return;
    }
    if (!isProjectRelativePath(value)) {
      issues.push(Object.assign({}, ref, { type: "non-project-relative-path", suggestion: "Use lv_assets/... relative paths only." }));
      return;
    }
    counts.missing += 1;
    issues.push(Object.assign({}, ref, { type: "missing-file", suggestion: "Restore the file or replace with the product fallback image." }));
  });
  counts.missing = issues.filter((issue) => issue.type === "missing-file").length;
  return { counts, issues };
}

module.exports = {
  ASSET_EXT_RE,
  collectConfigAssetRefs,
  scanTextAssetRefs,
  checkRefs,
  validateAndRepairConfigAssets,
  imageSrc,
  isAssetLike,
  isProjectRelativePath,
  projectFileExists,
  normalizeRelativePath,
  copyLocalAssetIntoProject,
  writeDataUrlAsset,
  safeFileName,
  issueReason,
  issueFix,
};
