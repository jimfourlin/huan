const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assetUtils = require("./asset-utils");

const projectRoot = __dirname;
const textExtensions = new Set([".html", ".css", ".js", ".json"]);
const excludedDirs = new Set(["node", "node_modules", ".git"]);

function loadConfig() {
  const code = fs.readFileSync(path.join(projectRoot, "huan-config.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window.HUAN_SITE_CONFIG;
}

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (textExtensions.has(ext)) {
      files.push(path.join(dir, entry.name));
    }
  }
}

function relative(file) {
  return path.relative(projectRoot, file).replace(/\\/g, "/");
}

function uniqueRefs(refs) {
  const seen = new Set();
  return refs.filter((ref) => {
    const key = [ref.source, ref.field, ref.path].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function main() {
  const config = loadConfig();
  const configReport = assetUtils.validateAndRepairConfigAssets(config, {
    projectRoot,
    targetDir: "lv_assets/uploads",
    repair: false,
  });

  const files = [];
  walk(projectRoot, files);
  const textRefs = [];
  files.forEach((file) => {
    const source = relative(file);
    const text = fs.readFileSync(file, "utf8");
    textRefs.push(...assetUtils.scanTextAssetRefs(text, source));
  });

  const refs = uniqueRefs(configReport.refs.concat(textRefs));
  const checked = assetUtils.checkRefs(projectRoot, refs);
  const configIssues = configReport.issues.map((issue) => Object.assign({}, issue, { scope: "config" }));
  const textIssues = checked.issues.map((issue) => Object.assign({}, issue, { scope: "text" }));
  const issues = uniqueRefs(configIssues.concat(textIssues));
  const missing = issues.filter((issue) => issue.type === "missing-file").length;
  const summary = {
    totalImageReferences: refs.length,
    validImageReferences: checked.counts.valid,
    missingImageReferences: missing,
    absolutePathReferences: checked.counts.absolute,
    externalPathReferences: checked.counts.external,
    blobOrFilePathReferences: checked.counts.runtime,
    issueCount: issues.length,
  };

  console.log("HUAN asset check");
  console.log(JSON.stringify(summary, null, 2));
  if (issues.length) {
    console.log("\nIssues:");
    issues.forEach((issue, index) => {
      const product = issue.productId ? ` productId=${issue.productId}` : "";
      const field = issue.field ? ` field=${issue.field}` : "";
      console.log(`${index + 1}. [${issue.type}] ${issue.source}${product}${field}`);
      console.log(`   path: ${issue.path}`);
      console.log(`   suggestion: ${issue.suggestion || suggestionFor(issue.type)}`);
    });
  } else {
    console.log("\nNo asset path issues found.");
  }

  if (issues.length) {
    process.exitCode = 1;
  }
}

function suggestionFor(type) {
  if (type === "missing-file") return "Restore the missing file or replace it with the product fallback image.";
  if (type === "absolute-path") return "Copy the file into lv_assets/uploads and save a project-relative path.";
  if (type === "external-path") return "Do not depend on remote assets; copy into lv_assets/uploads.";
  if (type === "blob-path" || type === "file-url") return "Upload through the controller so the file is copied into the project.";
  if (type === "non-project-relative-path") return "Use lv_assets/... project-relative paths only.";
  return "Review and replace this asset path.";
}

main();
