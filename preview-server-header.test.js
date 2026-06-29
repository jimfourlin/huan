const assert = require("assert");
const { createPackageHeaderValue } = require("./huan-preview-server");

const headerValue = createPackageHeaderValue("Huan-新版官网");

assert.strictEqual(headerValue, "Huan-%E6%96%B0%E7%89%88%E5%AE%98%E7%BD%91");
assert.doesNotThrow(() => {
  require("http").validateHeaderValue("X-HUAN-Package", headerValue);
});

console.log("preview-server-header.test.js passed");
