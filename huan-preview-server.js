const fs = require("fs");
const http = require("http");
const path = require("path");
const { exec } = require("child_process");

const root = __dirname;
const startPort = 4177;
const packageName = path.basename(root);
const packageHeaderValue = createPackageHeaderValue(packageName);
const expectedVersion = "save-sync-20260610-1";
const currentLinkFile = path.join(root, "\u5f53\u524d\u7f51\u9875\u94fe\u63a5.txt");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function createPackageHeaderValue(value) {
  return encodeURIComponent(value);
}

function sendFile(response, filePath) {
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
      "X-HUAN-Package": packageHeaderValue,
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

function createServer(port) {
  const server = http.createServer((request, response) => {
    const urlPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);
    if (!filePath.startsWith(root)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }
    sendFile(response, filePath);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < startPort + 20) {
      createServer(port + 1);
      return;
    }
    console.error(error.message);
    process.exit(1);
  });

  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/index.html#home`;
    const indexPath = path.join(root, "index.html");
    const indexText = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
    fs.writeFileSync(currentLinkFile, url + "\r\n", "utf8");
    console.log("HUAN preview package:", root);
    console.log("HUAN preview link:", url);
    console.log("Copyable link saved to:", currentLinkFile);
    console.log("Use this newly opened link. Close old 127.0.0.1:4177 tabs if they were opened before.");
    if (!indexText.includes(expectedVersion)) {
      console.warn("Warning: index.html does not include expected version " + expectedVersion);
    }
    exec(`start "" "${url}"`, { shell: "cmd.exe" });
  });
}

if (require.main === module) {
  createServer(startPort);
}

module.exports = {
  createPackageHeaderValue,
};

