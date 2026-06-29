const http = require("http");
const fs = require("fs/promises");
const fsSync = require("fs");
const os = require("os");
const path = require("path");
const assetUtils = require("./asset-utils");

const PORT = 43210;
const HOST = "127.0.0.1";
const projectFile = path.join(__dirname, "huan-config.js");
const indexFile = path.join(__dirname, "index.html");
const backupFile = path.join(__dirname, "backup", "last-saved-huan-config.js");
const downloadsFile = path.join(os.homedir(), "Downloads", "huan-config.js");
const uploadDir = path.join(__dirname, "lv_assets", "uploads");
const projectRoot = __dirname;
const placeholderImage = "lv_assets/placeholder.svg";

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

async function configVersion() {
  const stat = await fs.stat(projectFile);
  return {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    version: String(Math.round(stat.mtimeMs)) + "-" + String(stat.size),
  };
}

function parseConfigContent(content) {
  const match = String(content || "").match(/window\.HUAN_SITE_CONFIG\s*=\s*([\s\S]*?);\s*$/);
  if (!match) {
    throw new Error("Invalid HUAN config content");
  }
  return JSON.parse(match[1]);
}

function configContent(config) {
  return "window.HUAN_SITE_CONFIG = " + JSON.stringify(config, null, 2) + ";\n";
}

function formatAssetIssue(issue) {
  return [
    "[ASSET CHECK FAILED]",
    "productId: " + (issue.productId || "N/A"),
    "productName: " + (issue.productName || "N/A"),
    "field: " + (issue.field || "N/A"),
    "path: " + (issue.path || "N/A"),
    "reason: " + (issue.reason || issue.type || "unknown"),
    "fix: " + (issue.fix || "请重新上传该图片"),
  ].join("\n");
}

function logAssetCheckPassed(operation, report) {
  console.log("[ASSET CHECK PASSED] 所有图片资源检查通过", {
    operation: operation || "unknown",
    total: report && report.counts && report.counts.total,
    fixes: report && Array.isArray(report.fixes) ? report.fixes.length : 0,
  });
}

function logAssetCheckFailed(operation, report) {
  console.error("[ASSET CHECK FAILED]", {
    operation: operation || "unknown",
    issueCount: report && Array.isArray(report.issues) ? report.issues.length : 0,
  });
  (report.issues || []).forEach((issue) => console.error(formatAssetIssue(issue)));
}

function runAssetPreflight(config, options = {}) {
  const operation = options.operation || "save";
  const targetDir = path.relative(projectRoot, uploadDir).replace(/\\/g, "/");
  const firstPass = assetUtils.validateAndRepairConfigAssets(config, {
    projectRoot,
    targetDir,
    repair: true,
  });
  const secondPass = assetUtils.validateAndRepairConfigAssets(config, {
    projectRoot,
    targetDir,
    repair: false,
  });
  const report = Object.assign({}, secondPass, {
    fixes: firstPass.fixes || [],
    operation,
    passed: secondPass.issues.length === 0,
  });
  if (report.passed) {
    logAssetCheckPassed(operation, report);
  } else {
    logAssetCheckFailed(operation, report);
  }
  return report;
}

function imageSrc(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.src || "";
  }
  return typeof value === "string" ? value : "";
}

function localImageExists(src) {
  const value = String(src || "").trim();
  if (!value || /^(?:data:|https?:\/\/|\/\/)/i.test(value)) {
    return !!value;
  }
  const filePath = path.resolve(projectRoot, value.replace(/\\/g, "/"));
  if (!filePath.startsWith(projectRoot)) {
    return false;
  }
  try {
    return fsSync.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

function firstUsableImage(items, fallback) {
  const values = Array.isArray(items) ? items : [];
  const found = values.find((item) => localImageExists(imageSrc(item.image || item.src || item)));
  if (found) {
    return found.image || found.src || found;
  }
  return localImageExists(imageSrc(fallback)) ? fallback : null;
}

function imageOrFallback(value, fallback) {
  const src = imageSrc(value);
  if (localImageExists(src)) {
    return value;
  }
  const fallbackSrc = imageSrc(fallback);
  if (localImageExists(fallbackSrc)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.assign({}, value, { src: fallbackSrc });
    }
    return fallback;
  }
  if (localImageExists(placeholderImage)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.assign({}, value, { src: placeholderImage, isUploaded: false });
    }
    return placeholderImage;
  }
  return value;
}

const PRODUCT_ID_PATTERN = /(1003|1008|3009|3605|3623|6316|9956|9957|9963)/;

function productIdFromFileName(src) {
  const fileName = String(src || "").replace(/\\/g, "/").split("/").pop() || "";
  const match = fileName.match(PRODUCT_ID_PATTERN);
  return match ? match[1] : "";
}

function productIdFromPath(src) {
  const match = String(src || "").match(/(?:^|[\/\\-])(1003|1008|3009|3605|3623|6316|9956|9957|9963)(?=[\/\\-]|$)/);
  return match ? match[1] : "";
}

function extractProductIdFromImage(value) {
  const src = imageSrc(value);
  return productIdFromFileName(src) || productIdFromPath(src);
}

function homeProductId(item) {
  return extractProductIdFromImage(item && item.image) || String((item && item.productId) || "");
}

function imageNumber(value, key, fallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const number = Number(value[key]);
    return Number.isFinite(number) ? number : fallback;
  }
  return fallback;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function formattedCaptionHtml(value, options = {}) {
  const lines = String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) {
    return "";
  }
  if (options.plain) {
    return escapeHtml(lines.join(" "));
  }
  const title = lines[0] || "";
  const desc = lines.slice(1).join(" ");
  if (!desc) {
    return `<span class="caption-en">${escapeHtml(title)}</span>`;
  }
  return `<span class="caption-en">${escapeHtml(title)}</span><span class="caption-cn">${escapeHtml(desc)}</span>`;
}

function managedImageAttrs(value) {
  const src = escapeAttribute(imageSrc(value));
  const scale = imageNumber(value, "scale", 1);
  const offsetX = imageNumber(value, "offsetX", 50);
  const offsetY = imageNumber(value, "offsetY", 50);
  const managedType = value && value.isUploaded ? "uploaded" : "static";
  return `src="${src}" data-huan-managed-image="${managedType}" style="--huan-image-scale:${scale};--huan-object-position:${offsetX}% ${offsetY}%;--huan-offset-x:${offsetX};--huan-offset-y:${offsetY};"`;
}

async function syncHomeCategoryHtml(config) {
  const html = await fs.readFile(indexFile, "utf8");
  const nextHtml = syncStaticHtml(html, config);
  if (nextHtml !== html) {
    await fs.writeFile(indexFile, nextHtml, "utf8");
  }
  return true;
}

function replaceSection(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error("Cannot find " + label + " in index.html");
  }
  pattern.lastIndex = 0;
  return html.replace(pattern, replacement);
}

function staticImage(value) {
  return escapeAttribute(imageSrc(value));
}

function productIdsForStatic(config) {
  const ordered = [];
  const products = config && config.secondary && Array.isArray(config.secondary.products) ? config.secondary.products : [];
  products.forEach((product) => {
    if (product.productId && !ordered.includes(product.productId)) {
      ordered.push(product.productId);
    }
  });
  Object.keys((config.tertiary && config.tertiary.productCatalog) || {}).forEach((productId) => {
    if (!ordered.includes(productId)) {
      ordered.push(productId);
    }
  });
  return ordered;
}

function secondaryMeta(config, productId) {
  const products = config && config.secondary && Array.isArray(config.secondary.products) ? config.secondary.products : [];
  return products.find((product) => product.productId === productId) || { tag: "", title: productId, desc: "" };
}

const SECONDARY_PAGE_META = {
  all: {
    id: "secondary",
    eyebrow: "CATEGORY PAGE",
    title: "All Shoes Collection",
    desc: "Explore the complete HUAN selection across women's, men's and kids' shoes.",
  },
  women: {
    id: "secondary-women",
    eyebrow: "WOMEN'S SHOES",
    title: "Women's Shoes Collection",
    desc: "Loafers, flats, sandals and mules curated for a refined daily wardrobe.",
  },
  men: {
    id: "secondary-men",
    eyebrow: "MEN'S SHOES",
    title: "Men's Shoes Collection",
    desc: "Selected silhouettes for daily commuting, weekend styling and clean everyday wear.",
  },
  kids: {
    id: "secondary-kids",
    eyebrow: "KIDS' SHOES",
    title: "Kids' Shoes Collection",
    desc: "Comfortable, easy-wearing pairs for active days and polished family moments.",
  },
};

function secondaryProductIdsForGroup(config, groupKey) {
  const groups = config && config.controllerGroups && config.controllerGroups.secondary;
  return Array.isArray(groups && groups[groupKey]) ? groups[groupKey] : [];
}

function secondaryProductsForPage(config, groupKey) {
  const products = config && config.secondary && Array.isArray(config.secondary.products) ? config.secondary.products : [];
  if (groupKey === "all") {
    return ["women", "men", "kids"].flatMap((key) => {
      const ids = secondaryProductIdsForGroup(config, key);
      return ids.map((id) => products.find((item) => item.productId === id)).filter(Boolean);
    });
  }
  const ids = new Set(secondaryProductIdsForGroup(config, groupKey));
  return products.filter((item) => ids.has(item.productId));
}

function renderHeroSlides(config) {
  const slides = (config.home && Array.isArray(config.home.heroSlides) ? config.home.heroSlides : []);
  return slides.map((item, index) => {
    if (item.type === "video") {
      return `        <div class="hero-slide"><video autoplay muted loop playsinline preload="metadata" poster="${escapeAttribute(item.poster || "")}"><source src="${escapeAttribute(item.src || "")}" type="video/mp4"></video></div>`;
    }
    return `        <div class="hero-slide"><img ${managedImageAttrs(item.src || item.image || item)} alt="LUMIVISTA campaign slide ${index + 1}"></div>`;
  }).join("\n");
}

function renderHeroCopy(config) {
  const slides = (config.home && Array.isArray(config.home.heroSlides) ? config.home.heroSlides : []);
  const active = slides[0] || {};
  return formattedCaptionHtml(active.caption || config.home.heroCaption || "", { plain: true });
}

function renderHomeCategories(config) {
  return (config.home.categories || []).map((item) => {
    const productId = escapeAttribute(homeProductId(item));
    return `        <div class="activity-card clickable" onclick="showProductDetail('${productId}')"><div class="huan-image-frame"><img ${managedImageAttrs(item.image)}></div><h3>${escapeHtml(item.title || "")}</h3><p>${escapeHtml(item.cta || "Shop Now \u2192")}</p></div>`;
  }).join("\n");
}

function renderStories(config) {
  return (config.home.stories || []).map((item) => {
    const productId = escapeAttribute(homeProductId(item));
    return `      <div class="story-card clickable" onclick="showProductDetail('${productId}')"><img ${managedImageAttrs(item.image)}><div class="story-copy"><h3>${escapeHtml(item.title || "")}</h3><p>${escapeHtml(item.desc || "")}</p><button>Explore</button></div></div>`;
  }).join("\n");
}

function renderSceneSlides(config) {
  return (config.home.sceneSlides || []).map((item, index) => {
    return `          <figure class="trend-carousel-slide" data-product-id="${escapeAttribute(homeProductId(item))}"><img ${managedImageAttrs(item.image)} alt="Scene photography slide ${index + 1}"></figure>`;
  }).join("\n");
}

function renderSceneDots(config) {
  return (config.home.sceneSlides || []).map((item, index) => {
    return `          <button type="button" data-trend-slide="${index}"${index === 0 ? ' class="active"' : ""} aria-label="Show scene slide ${index + 1}"></button>`;
  }).join("\n");
}

function renderSceneCaption(config) {
  return formattedCaptionHtml(config.home.sceneCaption || "");
}

function renderVisualProducts(config) {
  return (config.home.visualProducts || []).map((item) => {
    const productId = escapeAttribute(homeProductId(item));
    return `        <div class="product clickable" onclick="showProductDetail('${productId}')"><div class="product-img"><img ${managedImageAttrs(item.image)}><span class="fav">♡</span></div><h3>${escapeHtml(item.title || "")}</h3><p>${escapeHtml(item.desc || "")}</p></div>`;
  }).join("\n");
}

function renderJournalPanels(config) {
  return (config.home.journalPanels || []).map((item) => {
    const title = escapeHtml(item.title || "");
    const productId = escapeAttribute(homeProductId(item));
    return `      <article class="journal-panel clickable" onclick="showProductDetail('${productId}')">\n        <img ${managedImageAttrs(item.image)} alt="${title} category">\n        <h2>${title}</h2>\n        <button>shop ${title}</button>\n      </article>`;
  }).join("\n");
}

function renderSecondaryProducts(config, groupKey) {
  const pageId = SECONDARY_PAGE_META[groupKey].id;
  return secondaryProductsForPage(config, groupKey).map((item) => {
    const productId = escapeAttribute(item.productId || "");
    return `      <div class="listing-card" onclick="showProductDetail('${productId}', '${pageId}')"><div class="listing-img"><img ${managedImageAttrs(item.image)}></div><div class="listing-tag">${escapeHtml(item.tag || "")}</div><div class="listing-title">${escapeHtml(item.title || "")}</div><div class="listing-desc">${escapeHtml(item.desc || "")}</div></div>`;
  }).join("\n");
}

function secondaryPageMeta(config, groupKey) {
  const pages = config && config.secondary && config.secondary.pages;
  const fromConfig = pages && pages[groupKey];
  if (fromConfig) {
    return Object.assign({}, SECONDARY_PAGE_META[groupKey], fromConfig);
  }
  if (groupKey === "all" && config && config.secondary) {
    return Object.assign({}, SECONDARY_PAGE_META[groupKey], {
      eyebrow: config.secondary.eyebrow || SECONDARY_PAGE_META[groupKey].eyebrow,
      title: config.secondary.title || SECONDARY_PAGE_META[groupKey].title,
      desc: config.secondary.desc || SECONDARY_PAGE_META[groupKey].desc,
    });
  }
  return SECONDARY_PAGE_META[groupKey];
}

function renderSecondaryPage(config, groupKey) {
  const meta = secondaryPageMeta(config, groupKey);
  return `  <main id="${meta.id}" class="page secondary-page" data-secondary-group="${groupKey}">\n    <section class="page-head"><div><p>${escapeHtml(meta.eyebrow)}</p><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.desc)}</p></div><button class="back" onclick="showPage('home')">← 返回首页</button></section>\n    <section class="listing-grid">\n${renderSecondaryProducts(config, groupKey)}\n    </section>\n  </main>`;
}

function renderSecondaryPages(config) {
  return ["all", "women", "men", "kids"].map((groupKey) => renderSecondaryPage(config, groupKey)).join("\n\n");
}

function productSlices(config, productId) {
  const catalog = config.tertiary && config.tertiary.productCatalog && config.tertiary.productCatalog[productId];
  const slices = catalog && Array.isArray(catalog.slices) && catalog.slices.length
    ? catalog.slices
    : ((config.tertiary && Array.isArray(config.tertiary.slices)) ? config.tertiary.slices : []);
  const next = slices.slice();
  if (next.length === 3) {
    next.splice(2, 0, JSON.parse(JSON.stringify(next[1] || next[0] || {})));
  }
  return next;
}

function renderSlices(config, productId) {
  const slices = productSlices(config, productId);
  const sliceBlocks = slices.slice(0, 3).map((item) => {
    return `      <div class="slice model-showcase">\n        <div class="slice-copy">\n          <h2>${escapeHtml(item.title || "")}</h2>\n          <p>${escapeHtml(item.desc || "")}</p>\n        </div>\n        <img ${managedImageAttrs(item.image)} alt="${escapeAttribute(item.title || "Model styling image")}">\n      </div>`;
  }).join("\n");
  const longItem = slices[3];
  const longBlock = longItem ? `\n      <div class="long-img">\n        <img ${managedImageAttrs(longItem.image)} alt="LUMIVISTA detail long image">\n      </div>` : "";
  return `<section class="detail-slices">\n${sliceBlocks}${longBlock}\n    </section>`;
}

function renderProductEditorial(catalog) {
  const story = catalog && catalog.story ? catalog.story : "";
  const intro = catalog && catalog.intro ? catalog.intro : "";
  if (!story && !intro) {
    return "";
  }
  return `    <section class="product-editorial">\n      <p>PRODUCT NOTE</p>\n      <div>\n        <h2>${escapeHtml(story)}</h2>\n        <p>${escapeHtml(intro)}</p>\n      </div>\n    </section>\n`;
}

function renderTertiaryPage(config, productId) {
  const catalog = config.tertiary.productCatalog[productId] || { gallery: [], modelCards: [], detailImages: [] };
  const meta = secondaryMeta(config, productId);
  const gallery = Array.isArray(catalog.gallery) ? catalog.gallery : [];
  const models = Array.isArray(catalog.modelCards) ? catalog.modelCards : [];
  const details = Array.isArray(catalog.detailImages) ? catalog.detailImages : [];
  const firstGallery = gallery[0] && (gallery[0].image || gallery[0].src || gallery[0]);
  const detailFallback = firstUsableImage(details, firstGallery);
  const thumbs = gallery.map((item, index) => {
    const thumb = item.thumb || item.image || item.src || item;
    return `        <div class="thumb-item${index === 0 ? " active" : ""}" onmouseenter="changeProductImage('${escapeAttribute(productId)}', ${index})" onclick="changeProductImage('${escapeAttribute(productId)}', ${index})"><img ${managedImageAttrs(thumb)}></div>`;
  }).join("\n");
  const modelCards = models.map((item, index) => {
    return `      <div class="detail-card"><img ${managedImageAttrs(item.image || item.src || item)}><h3>${escapeHtml(item.title || "Model " + String(index + 1).padStart(2, "0"))}</h3></div>`;
  }).join("\n");
  const detailCards = details.map((item, index) => {
    const image = imageOrFallback(item.image || item.src || item, detailFallback);
    return `        <figure class="pdd-detail-card"><img ${managedImageAttrs(image)} alt="${escapeAttribute(productId)} product detail section ${String(index + 1).padStart(2, "0")}"></figure>`;
  }).join("\n");
  return `  <main id="tertiary-${escapeAttribute(productId)}" class="page product-detail-page" data-product-id="${escapeAttribute(productId)}">\n    <section class="page-head"><div><p>${escapeHtml(meta.tag || "")}</p><h1>${escapeHtml(meta.title || productId)}</h1><p>${escapeHtml(meta.desc || "")}</p></div><button class="back" onclick="showReturnPage()">← 返回二级页面</button></section>\n    <section class="detail-product">\n      <div class="thumb-column">\n${thumbs}\n      </div>\n      <div class="hero-product"><img id="mainProductImage-${escapeAttribute(productId)}" data-main-product-image ${managedImageAttrs(firstGallery)}><div class="hero-nav"><button onclick="prevProductImage('${escapeAttribute(productId)}')">‹</button><button onclick="nextProductImage('${escapeAttribute(productId)}')">›</button></div></div>\n    </section>\n${renderProductEditorial(catalog)}    <section class="detail-grid">\n${modelCards}\n    </section>\n    <section class="pdd-detail" aria-label="${escapeAttribute(productId)} product detail images">\n      <div class="pdd-detail-inner">\n${detailCards}\n      </div>\n    </section>\n    ${renderSlices(config, productId)}\n  </main>`;
}

function renderTertiaryPages(config) {
  return productIdsForStatic(config).map((productId) => renderTertiaryPage(config, productId)).join("\n\n");
}

function syncStaticHtml(html, config) {
  let next = html;
  next = replaceSection(next, /(<div class="hero-track">\s*)([\s\S]*?)(\s*<\/div>\s*<div class="hero-copy">)/, `$1\n${renderHeroSlides(config)}$3`, "home hero track");
  next = replaceSection(next, /(<div class="hero-copy"><p>)([\s\S]*?)(<\/p><div class="hero-bars">)/, `$1${renderHeroCopy(config)}$3`, "home hero copy");
  next = replaceSection(next, /(<div class="activity-grid refined-cats">\s*)([\s\S]*?)(\s*<\/div>\s*<\/section>)/, `$1\n${renderHomeCategories(config)}$3`, "home product photography grid");
  next = replaceSection(next, /(<section class="home-section stories refined-stories">\s*)([\s\S]*?)(\s*<\/section>)/, `$1\n${renderStories(config)}$3`, "home story cards");
  next = replaceSection(next, /(<div class="trend-carousel-track">\s*)([\s\S]*?)(\s*<\/div>\s*<div class="trend-copy">)/, `$1\n${renderSceneSlides(config)}$3`, "home scene carousel");
  next = replaceSection(next, /(<div class="trend-copy"><p>)([\s\S]*?)(<\/p><\/div>)/, `$1${renderSceneCaption(config)}$3`, "home scene caption");
  next = replaceSection(next, /(<div class="trend-carousel-dots"[^>]*>\s*)([\s\S]*?)(\s*<\/div>)/, `$1\n${renderSceneDots(config)}$3`, "home scene carousel dots");
  next = replaceSection(next, /(<div class="product-row refined-products">\s*)([\s\S]*?)(\s*<\/div>\s*<\/section>)/, `$1\n${renderVisualProducts(config)}$3`, "home visual products");
  next = replaceSection(next, /(<section class="journal-banner journal-triptych"[^>]*>\s*)([\s\S]*?)(\s*<\/section>)/, `$1\n${renderJournalPanels(config)}$3`, "home journal panels");
  next = replaceSection(next, /\s*<main id="secondary"[\s\S]*?(?=\s*<main id="tertiary-)/, `\n\n${renderSecondaryPages(config)}\n\n`, "secondary pages");
  next = replaceSection(next, /\s*<main id="tertiary-[\s\S]*?(?=\s*<footer class="footer footer-about">)/, `\n\n${renderTertiaryPages(config)}\n`, "tertiary product pages");
  return next;
}

async function syncSiteHtml(config) {
  if (!config || !config.home || !config.secondary || !config.tertiary) {
    return false;
  }
  const html = await fs.readFile(indexFile, "utf8");
  const nextHtml = syncStaticHtml(html, config);
  if (nextHtml !== html) {
    await fs.writeFile(indexFile, nextHtml, "utf8");
  }
  return true;
}

async function writeLastSavedBackup(content) {
  await fs.mkdir(path.dirname(backupFile), { recursive: true });
  await fs.writeFile(backupFile, content, "utf8");
}

async function loadOfficialConfigContent() {
  try {
    const content = await fs.readFile(projectFile, "utf8");
    parseConfigContent(content);
    return content;
  } catch (error) {
    const backupContent = await fs.readFile(backupFile, "utf8");
    parseConfigContent(backupContent);
    await fs.writeFile(projectFile, backupContent, "utf8");
    return backupContent;
  }
}

async function protectSavedConfigOnStartup() {
  const content = await loadOfficialConfigContent();
  const config = parseConfigContent(content);
  const assetReport = runAssetPreflight(config, { operation: "startup" });
  const nextContent = assetReport.fixes.length ? configContent(config) : content;
  if (assetReport.fixes.length) {
    await fs.writeFile(projectFile, nextContent, "utf8");
  }
  await writeLastSavedBackup(nextContent);
  await syncSiteHtml(config);
}

async function syncHomeCategoryHtml(config) {
  return syncSiteHtml(config);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    const versionInfo = await configVersion().catch(() => null);
    sendJson(res, 200, {
      ok: true,
      projectFile,
      backupFile,
      downloadsFile,
      uploadDir,
      version: versionInfo && versionInfo.version,
    });
    return;
  }

  if (req.method === "GET" && req.url === "/version") {
    try {
      const versionInfo = await configVersion();
      sendJson(res, 200, {
        ok: true,
        projectFile,
        backupFile,
        version: versionInfo.version,
        mtimeMs: versionInfo.mtimeMs,
        size: versionInfo.size,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown version error",
      });
    }
    return;
  }

  if (req.method === "GET" && req.url === "/config") {
    try {
      const content = await fs.readFile(projectFile, "utf8");
      const versionInfo = await configVersion();
      sendJson(res, 200, {
        ok: true,
        projectFile,
        content,
        version: versionInfo.version,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown config read error",
      });
    }
    return;
  }

  if (req.method === "GET" && req.url === "/asset-report") {
    try {
      const content = await fs.readFile(projectFile, "utf8");
      const config = parseConfigContent(content);
      const assetReport = assetUtils.validateAndRepairConfigAssets(config, {
        projectRoot,
        targetDir: path.relative(projectRoot, uploadDir).replace(/\\/g, "/"),
        repair: false,
      });
      sendJson(res, 200, {
        ok: true,
        assetReport,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown asset report error",
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/preflight") {
    try {
      const raw = await readBody(req);
      const parsed = JSON.parse(raw || "{}");
      const content = typeof parsed.content === "string" ? parsed.content : "";
      const operation = String(parsed.operation || "export");
      if (!content.trim()) {
        sendJson(res, 400, { ok: false, error: "Missing config content" });
        return;
      }
      const config = parseConfigContent(content);
      const assetReport = runAssetPreflight(config, { operation });
      if (!assetReport.passed) {
        sendJson(res, 400, {
          ok: false,
          error: "Asset validation failed before " + operation,
          assetReport,
        });
        return;
      }
      sendJson(res, 200, {
        ok: true,
        repairedContent: configContent(config),
        assetReport,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown asset preflight error",
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/save") {
    try {
      const raw = await readBody(req);
      const parsed = JSON.parse(raw || "{}");
      const content = typeof parsed.content === "string" ? parsed.content : "";
      if (!content.trim()) {
        sendJson(res, 400, { ok: false, error: "Missing config content" });
        return;
      }

      const config = parseConfigContent(content);
      const assetReport = runAssetPreflight(config, { operation: "save" });
      if (!assetReport.passed) {
        sendJson(res, 400, {
          ok: false,
          error: "Asset validation failed before save",
          assetReport,
        });
        return;
      }
      const repairedContent = configContent(config);
      await fs.writeFile(projectFile, repairedContent, "utf8");
      await writeLastSavedBackup(repairedContent);
      await fs.mkdir(path.dirname(downloadsFile), { recursive: true });
      await fs.writeFile(downloadsFile, repairedContent, "utf8");
      const syncedSiteHtml = await syncSiteHtml(config);

      const versionInfo = await configVersion();
      sendJson(res, 200, {
        ok: true,
        projectFile,
        backupFile,
        downloadsFile,
        syncedSiteHtml,
        assetReport,
        version: versionInfo.version,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown save error",
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/upload") {
    try {
      const raw = await readBody(req);
      const parsed = JSON.parse(raw || "{}");
      const name = path.basename(String(parsed.name || "image.png")).replace(/[^\w.\-()\u4e00-\u9fff ]+/g, "_");
      const requestedDir = String(parsed.targetDir || "").replace(/\\/g, "/").replace(/^\/+/, "");
      const dataUrl = String(parsed.dataUrl || "");
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        sendJson(res, 400, { ok: false, error: "Invalid upload data" });
        return;
      }
      const safeDir =
        requestedDir &&
        !requestedDir.includes("..") &&
        (requestedDir === "lv_assets" || requestedDir.startsWith("lv_assets/"))
          ? requestedDir
          : path.relative(projectRoot, uploadDir).replace(/\\/g, "/");
      const targetDir = path.resolve(projectRoot, safeDir);
      if (!targetDir.toLowerCase().startsWith(projectRoot.toLowerCase())) {
        sendJson(res, 400, { ok: false, error: "Upload target outside project" });
        return;
      }
      await fs.mkdir(targetDir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const fileName = stamp + "-" + name;
      const target = path.join(targetDir, fileName);
      await fs.writeFile(target, Buffer.from(match[2], "base64"));
      const relativeTarget = path.relative(projectRoot, target).replace(/\\/g, "/");
      sendJson(res, 200, {
        ok: true,
        src: relativeTarget,
        file: target,
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error && error.message ? error.message : "Unknown upload error",
      });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

protectSavedConfigOnStartup()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log("HUAN save helper running");
      console.log("Project file:", projectFile);
      console.log("Last saved backup:", backupFile);
      console.log("Downloads file:", downloadsFile);
      console.log("Listening on http://" + HOST + ":" + PORT);
    });
  })
  .catch((error) => {
    console.error("Cannot start HUAN save helper:", error && error.message ? error.message : error);
    process.exit(1);
  });


