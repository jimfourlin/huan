(function () {
  const SAVE_HELPER_URL = "http://127.0.0.1:43210";
  const HISTORY_LIMIT = 120;
  const PANEL_MIN_WIDTH = 360;
  const PANEL_MIN_HEIGHT = 420;
  const PANEL_MAX_WIDTH = 760;
  const PANEL_MAX_HEIGHT_MARGIN = 24;
  const PANEL_EDGE_PADDING = 16;
  const EXPECTED_PROJECT_FOLDER = "HUAN_site_package_20260610";

  const defaultConfig = {
    home: {
      heroCaption: "Woven Light in a Quiet Interior",
      heroSlides: [
        { type: "video", src: "lv_assets/hero-carousel.mp4", poster: "lv_assets/hero.jpg", caption: "Woven Light in a Quiet Interior" },
        { type: "image", src: "lv_assets/hero.jpg", caption: "Black Straps Against Pleated Motion" },
        { type: "image", src: "lv_assets/journal.jpg", caption: "Silver Texture with a Low Heel" },
        { type: "image", src: "lv_assets/story1.jpg", caption: "Bare Ankles, Soft Proportion" },
        { type: "image", src: "lv_assets/story2.jpg", caption: "Pale Layers Beside Warm Linen" },
        { type: "image", src: "lv_assets/model5.jpg", caption: "Soft Shine Close to the Floor" },
      ],
      categories: [
        { title: "Ivory T-Bar", cta: "白色线条", image: "lv_assets/cat1.jpg" },
        { title: "Black Patent", cta: "黑色低跟", image: "lv_assets/cat2.jpg" },
        { title: "Silver Weave", cta: "银色编织", image: "lv_assets/cat3.jpg" },
        { title: "Open Mule", cta: "开口低跟", image: "lv_assets/cat4.jpg" },
        { title: "Pearl Weave", cta: "浅色织面", image: "lv_assets/cat5.jpg" },
      ],
      stories: [
        { title: "Woven Close-Up", desc: "银灰编织与柔光边界。", image: "lv_assets/story1.jpg" },
        { title: "Warm Metallic", desc: "金色低跟进入日常步态。", image: "lv_assets/story2.jpg" },
      ],
      sceneCaption: "Braided Shadow\n黑色编织，留白轮廓。",
      sceneSlides: [
        { image: "lv_assets/home-carousel-1.png" },
        { image: "lv_assets/home-carousel-2.png" },
        { image: "lv_assets/home-carousel-3.png" },
        { image: "lv_assets/home-carousel-4.png" },
        { image: "lv_assets/home-carousel-5.png" },
      ],
      visualProducts: [
        { title: "Open Weave", desc: "银色织面，轻透脚背。", image: "lv_assets/prod1.jpg" },
        { title: "Silver Mule", desc: "开后跟与小方扣。", image: "lv_assets/prod2.jpg" },
        { title: "Pale Slip-On", desc: "浅色织面，贴近棉麻。", image: "lv_assets/prod3.jpg" },
        { title: "White Flat", desc: "低轮廓，干净留白。", image: "lv_assets/prod4.jpg" },
      ],
      journalPanels: [
        { title: "face", image: "lv_assets/journal-face.png" },
        { title: "beauty tools", image: "lv_assets/journal-tools.png" },
        { title: "body", image: "lv_assets/journal-body.png" },
      ],
    },
    secondary: {
      eyebrow: "FULL EDIT",
      title: "Measured Ease",
      desc: "低跟、编织与柔光留白。",
      products: [
        { tag: "IVORY NOTE", title: "Quiet T-Bar", desc: "白色皮面，细窄 T 字带。", image: "lv_assets/prod1.jpg" },
        { tag: "BLACK PATENT", title: "Gloss T-Bar", desc: "黑色亮面，低跟节奏。", image: "lv_assets/prod2.jpg" },
        { tag: "SILVER WEAVE", title: "Open Weave", desc: "银色编织，轻透脚背。", image: "lv_assets/prod3.jpg" },
        { tag: "METALLIC MULE", title: "Silver Ease", desc: "开后跟，方扣收住重心。", image: "lv_assets/prod4.jpg" },
        { tag: "PEARL WEAVE", title: "Pale Slip-On", desc: "浅色织面，柔和低跟。", image: "lv_assets/cat1.jpg" },
      ],
    },
    tertiary: {
      eyebrow: "PRODUCT DETAIL PAGE",
      title: "AURORA LOAFER",
      desc: "A refined product detail experience with gallery views, lifestyle scenes and material storytelling.",
      mainImage: "lv_assets/prod3.jpg",
      gallery: [
        { image: "lv_assets/prod1.jpg", thumb: "lv_assets/cat3.jpg" },
        { image: "lv_assets/prod2.jpg", thumb: "lv_assets/cat4.jpg" },
        { image: "lv_assets/prod3.jpg", thumb: "lv_assets/cat5.jpg" },
        { image: "lv_assets/prod4.jpg", thumb: "lv_assets/prod1.jpg" },
        { image: "lv_assets/cat1.jpg", thumb: "lv_assets/prod2.jpg" },
      ],
      modelCards: [
        { title: "Model 01", image: "lv_assets/hero.jpg" },
        { title: "Model 02", image: "lv_assets/story1.jpg" },
        { title: "Model 03", image: "lv_assets/story2.jpg" },
        { title: "Model 04", image: "lv_assets/model5.jpg" },
        { title: "Scene 05", image: "lv_assets/journal.jpg" },
        { title: "Scene 06", image: "lv_assets/model6.jpg" },
        { title: "Scene 07", image: "lv_assets/model7.jpg" },
        { title: "Scene 08", image: "lv_assets/model8.jpg" },
        { title: "Scene 09", image: "lv_assets/model9.jpg" },
        { title: "Scene 10", image: "lv_assets/model10.jpg" },
      ],
      detailImages: [
        "lv_assets/photo/1003/1003-pdd/20260611025631-1003-pdd-1 (1).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (2).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (3).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (4).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (5).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (6).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (7).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (8).jpg",
        "lv_assets/photo/1003/1003-pdd/1003-pdd-1 (9).jpg",
      ],
      slices: [
        { title: "On-foot line", desc: "A first read of proportion, strap and heel.", image: "lv_assets/model6.jpg" },
        { title: "Styled with fabric", desc: "The shoe set against movement, pleats and soft light.", image: "lv_assets/model7.jpg" },
        { title: "Close editorial crop", desc: "Texture and silhouette seen without extra decoration.", image: "lv_assets/model8.jpg" },
      ],
    },
  };

  let currentProductIndex = 0;
  let activeProductId = "";
  const state = normalizeConfig(mergeConfig(clone(defaultConfig), window.HUAN_SITE_CONFIG || {}));
  const undoStack = [];
  const redoStack = [];

  let activeTab = "home";
  let currentFieldPath = "";
  let helperConnected = false;
  let helperMessage = "未连接保存助手";
  let isEditorOpen = false;
  let statusTimer = null;
  let panelFrame = null;
  let dragState = null;
  let resizeState = null;
  let pendingEditorScrollTop = null;
  const placeholderImage = { src: "lv_assets/placeholder.svg", scale: 1, offsetX: 50, offsetY: 50, isUploaded: false };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeConfig(base, patch) {
    if (!patch || typeof patch !== "object") {
      return base;
    }
    Object.keys(patch).forEach((key) => {
      const next = patch[key];
      if (Array.isArray(next)) {
        base[key] = next.map((item) => (item && typeof item === "object" && !Array.isArray(item) ? mergeConfig({}, item) : item));
      } else if (next && typeof next === "object") {
        base[key] = mergeConfig(base[key] && typeof base[key] === "object" ? base[key] : {}, next);
      } else {
        base[key] = next;
      }
    });
    return base;
  }

  function normalizeImageValue(value, fallbackSrc) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        src: value.src || fallbackSrc || "",
        scale: clampNumber(value.scale, 1, 0.5, 3),
        offsetX: clampNumber(value.offsetX, 50, 0, 100),
        offsetY: clampNumber(value.offsetY, 50, 0, 100),
        isUploaded: !!value.isUploaded,
      };
    }
    return {
      src: typeof value === "string" ? value : fallbackSrc || "",
      scale: 1,
      offsetX: 50,
      offsetY: 50,
      isUploaded: false,
    };
  }

  function clampNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, number));
  }

  function normalizeGalleryItems(gallery, fallbackGallery) {
    const source = Array.isArray(gallery) && gallery.length ? gallery : fallbackGallery;
    return source.map((item, index) => ({
      image: normalizeImageValue(item.image || item.src || item, fallbackGallery[index] && fallbackGallery[index].image.src),
      thumb: normalizeImageValue(item.thumb || item.image || item.src || item, fallbackGallery[index] && fallbackGallery[index].thumb.src),
    }));
  }

  function normalizeSliceItems(slices, fallbackSlices) {
    const source = Array.isArray(slices) && slices.length ? slices : fallbackSlices;
    const result = source.map((item, index) => {
      const fallback = fallbackSlices[Math.min(index, fallbackSlices.length - 1)] || {};
      const next = { image: normalizeImageValue(item.image || item.src || item, fallback.image) };
      if (index < 3) {
        next.title = item.title || fallback.title || "";
        next.desc = item.desc || fallback.desc || "";
      }
      return next;
    });
    if (result.length === 3) {
      result.splice(2, 0, clone(result[1] || result[0] || {}));
    }
    return result;
  }

  function normalizeProductCatalog(catalog) {
    const source = catalog && typeof catalog === "object" ? catalog : {};
    return Object.keys(source).reduce((result, productId) => {
      const entry = source[productId] || {};
      result[productId] = {
        gallery: (Array.isArray(entry.gallery) ? entry.gallery : []).map((item) => {
          const image = normalizeImageValue(item.image || item.src || item, "");
          return {
            image: image,
            thumb: normalizeImageValue(item.thumb || item.image || item.src || item, image.src),
          };
        }),
        modelCards: (Array.isArray(entry.modelCards) ? entry.modelCards : []).map((item, index) => ({
          title: item.title || "Model " + String(index + 1).padStart(2, "0"),
          image: normalizeImageValue(item.image || item.src || item, ""),
        })),
        detailImages: (Array.isArray(entry.detailImages) ? entry.detailImages : []).map((item) =>
          normalizeImageValue(item.image || item.src || item, "")
        ),
        slices: Array.isArray(entry.slices) ? normalizeSliceItems(entry.slices, defaultConfig.tertiary.slices) : [],
        story: entry.story || "",
        intro: entry.intro || "",
      };
      return result;
    }, {});
  }

  function normalizeConfig(config) {
    config.home.heroSlides = config.home.heroSlides.map((item, index) => {
      const fallback = defaultConfig.home.heroSlides[index] || defaultConfig.home.heroSlides[0];
      const caption = item.caption || config.home.heroCaption || fallback.caption || defaultConfig.home.heroCaption;
      if (item.type === "video" || fallback.type === "video") {
        return {
          type: "video",
          src: item.src || fallback.src,
          poster: item.poster || fallback.poster,
          caption: caption,
        };
      }
      return {
        type: "image",
        src: normalizeImageValue(item.src || item.image || item, fallback.src),
        caption: caption,
      };
    });

    config.home.categories = config.home.categories.map((item, index) => {
      const fallback = defaultConfig.home.categories[index] || defaultConfig.home.categories[0];
      return {
        productId: item.productId || "",
        title: item.title || fallback.title,
        cta: item.cta || fallback.cta || "Shop Now \u2192",
        image: normalizeImageValue(item.image, fallback.image),
      };
    });

    config.home.stories = config.home.stories.map((item, index) => ({
      productId: item.productId || "",
      title: item.title || defaultConfig.home.stories[index].title,
      desc: item.desc || defaultConfig.home.stories[index].desc,
      image: normalizeImageValue(item.image, defaultConfig.home.stories[index].image),
    }));

    config.home.sceneSlides = config.home.sceneSlides.map((item, index) => ({
      productId: item.productId || "",
      image: normalizeImageValue(item.image, defaultConfig.home.sceneSlides[index].image),
    }));

    config.home.visualProducts = config.home.visualProducts.map((item, index) => ({
      productId: item.productId || "",
      title: item.title || defaultConfig.home.visualProducts[index].title,
      desc: item.desc || defaultConfig.home.visualProducts[index].desc,
      image: normalizeImageValue(item.image, defaultConfig.home.visualProducts[index].image),
    }));

    config.home.journalPanels = config.home.journalPanels.map((item, index) => ({
      productId: item.productId || "",
      title: item.title || defaultConfig.home.journalPanels[index].title,
      image: normalizeImageValue(item.image, defaultConfig.home.journalPanels[index].image),
    }));

    config.secondary.products = config.secondary.products.map((item, index) => ({
      productId: item.productId || "",
      tag: item.tag || defaultConfig.secondary.products[Math.min(index, defaultConfig.secondary.products.length - 1)].tag,
      title: item.title || defaultConfig.secondary.products[Math.min(index, defaultConfig.secondary.products.length - 1)].title,
      desc: item.desc || defaultConfig.secondary.products[Math.min(index, defaultConfig.secondary.products.length - 1)].desc,
      image: normalizeImageValue(item.image, defaultConfig.secondary.products[Math.min(index, defaultConfig.secondary.products.length - 1)].image),
    }));
    config.secondary.pages = config.secondary.pages || {};

    config.tertiary.productCatalog = normalizeProductCatalog(config.tertiary.productCatalog);
    const productIds = Object.keys(config.tertiary.productCatalog);
    const preferredProductId =
      config.tertiary.activeProductId ||
      (config.secondary.products.find((item) => item.productId) || {}).productId ||
      productIds[0] ||
      "";
    if (preferredProductId && config.tertiary.productCatalog[preferredProductId]) {
      activeProductId = preferredProductId;
      config.tertiary.activeProductId = preferredProductId;
      config.tertiary.gallery = clone(config.tertiary.productCatalog[preferredProductId].gallery);
      config.tertiary.modelCards = clone(config.tertiary.productCatalog[preferredProductId].modelCards);
      config.tertiary.detailImages = clone(config.tertiary.productCatalog[preferredProductId].detailImages);
    }

    if (Array.isArray(config.tertiary.productImages)) {
      const thumbs = Array.isArray(config.tertiary.thumbs) ? config.tertiary.thumbs : [];
      config.tertiary.gallery = config.tertiary.productImages.map((image, index) => ({
        image,
        thumb: thumbs[index] || image,
      }));
    }

    config.tertiary.gallery = normalizeGalleryItems(config.tertiary.gallery, normalizeGalleryItems(defaultConfig.tertiary.gallery, defaultConfig.tertiary.gallery));

    config.tertiary.modelCards = config.tertiary.modelCards.map((item, index) => ({
      title: item.title || defaultConfig.tertiary.modelCards[Math.min(index, defaultConfig.tertiary.modelCards.length - 1)].title,
      image: normalizeImageValue(item.image, defaultConfig.tertiary.modelCards[Math.min(index, defaultConfig.tertiary.modelCards.length - 1)].image),
    }));

    config.tertiary.detailImages = config.tertiary.detailImages.map((item, index) =>
      normalizeImageValue(item, defaultConfig.tertiary.detailImages[Math.min(index, defaultConfig.tertiary.detailImages.length - 1)])
    );

    config.tertiary.slices = normalizeSliceItems(config.tertiary.slices, defaultConfig.tertiary.slices);
    Object.keys(config.tertiary.productCatalog).forEach((productId) => {
      const product = config.tertiary.productCatalog[productId];
      product.slices = product.slices && product.slices.length ? normalizeSliceItems(product.slices, config.tertiary.slices) : clone(config.tertiary.slices);
    });

    delete config.tertiary.productImages;
    delete config.tertiary.thumbs;

    currentProductIndex = Math.max(
      0,
      config.tertiary.gallery.findIndex((item) => item.image.src === config.tertiary.mainImage)
    );
    if (currentProductIndex < 0 || currentProductIndex >= config.tertiary.gallery.length) {
      currentProductIndex = 0;
    }
    config.tertiary.mainImage = config.tertiary.gallery[currentProductIndex].image.src;

    return config;
  }

  function getDefaultPanelFrame() {
    const maxWidth = Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, window.innerWidth - PANEL_EDGE_PADDING * 2));
    const width = Math.min(480, maxWidth);
    const height = Math.max(PANEL_MIN_HEIGHT, Math.min(760, window.innerHeight - PANEL_EDGE_PADDING * 2));
    const x = Math.max(PANEL_EDGE_PADDING, window.innerWidth - width - 32);
    const y = Math.max(PANEL_EDGE_PADDING, 24);
    return clampPanelFrame({
      x: x,
      y: y,
      width: width,
      height: height,
    });
  }

  function clampPanelFrame(frame) {
    const maxWidth = Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, window.innerWidth - PANEL_EDGE_PADDING * 2));
    const maxHeight = Math.max(PANEL_MIN_HEIGHT, window.innerHeight - PANEL_MAX_HEIGHT_MARGIN * 2);
    const width = Math.max(PANEL_MIN_WIDTH, Math.min(maxWidth, Math.round(frame.width)));
    const height = Math.max(PANEL_MIN_HEIGHT, Math.min(maxHeight, Math.round(frame.height)));
    const maxX = Math.max(PANEL_EDGE_PADDING, window.innerWidth - width - PANEL_EDGE_PADDING);
    const maxY = Math.max(PANEL_EDGE_PADDING, window.innerHeight - height - PANEL_EDGE_PADDING);
    return {
      x: Math.min(maxX, Math.max(PANEL_EDGE_PADDING, Math.round(frame.x))),
      y: Math.min(maxY, Math.max(PANEL_EDGE_PADDING, Math.round(frame.y))),
      width: width,
      height: height,
    };
  }

  function resetPanelFrame() {
    panelFrame = getDefaultPanelFrame();
    applyPanelFrame();
  }

  function applyPanelFrame() {
    const editor = document.querySelector(".huan-editor");
    if (!editor || !panelFrame) {
      return;
    }
    panelFrame = clampPanelFrame(panelFrame);
    editor.style.setProperty("left", panelFrame.x + "px", "important");
    editor.style.setProperty("top", panelFrame.y + "px", "important");
    editor.style.setProperty("right", "auto", "important");
    editor.style.setProperty("bottom", "auto", "important");
    editor.style.setProperty("width", panelFrame.width + "px", "important");
    editor.style.setProperty("height", panelFrame.height + "px", "important");
  }

  function setHelperStatus(message, connected) {
    helperMessage = message;
    helperConnected = connected;
    updateActionState();
  }

  function isExpectedSaveTarget(projectFile) {
    const normalized = String(projectFile || "").replace(/\\/g, "/").toLowerCase();
    return normalized.indexOf(EXPECTED_PROJECT_FOLDER.toLowerCase() + "/huan-config.js") !== -1;
  }

  async function probeSaveHelper() {
    try {
      const response = await fetch(SAVE_HELPER_URL + "/health", { method: "GET" });
      if (!response.ok) {
        throw new Error("Health check failed");
      }
      const json = await response.json();
      if (!isExpectedSaveTarget(json.projectFile)) {
        setHelperStatus("保存助手路径不匹配，请关闭旧助手并从当前目录启动: " + json.projectFile, false);
        return false;
      }
      setHelperStatus("保存助手已连接: " + json.projectFile, true);
      return true;
    } catch (error) {
      setHelperStatus("未连接保存助手，请双击当前目录的 start-save-helper.cmd", false);
      return false;
    }
  }

  function configText() {
    return "window.HUAN_SITE_CONFIG = " + JSON.stringify(state, null, 2) + ";\n";
  }

  function parseConfigText(content) {
    const match = String(content || "").match(/window\.HUAN_SITE_CONFIG\s*=\s*([\s\S]*?);\s*$/);
    return match ? JSON.parse(match[1]) : null;
  }

  function applyRepairedConfig(content) {
    const parsed = parseConfigText(content);
    if (!parsed) {
      return;
    }
    const next = normalizeConfig(parsed);
    Object.keys(state).forEach(function (key) {
      delete state[key];
    });
    mergeConfig(state, next);
    renderStaticContent();
    buildEditor();
  }

  function formatAssetIssues(result) {
    const issues = result && result.assetReport && Array.isArray(result.assetReport.issues) ? result.assetReport.issues : [];
    if (!issues.length) return "";
    issues.forEach(function (issue) {
      console.error("[ASSET CHECK FAILED]\nproductId: " + (issue.productId || "N/A") +
        "\nproductName: " + (issue.productName || "N/A") +
        "\nfield: " + (issue.field || "N/A") +
        "\npath: " + (issue.path || "N/A") +
        "\nreason: " + (issue.reason || issue.type || "unknown") +
        "\nfix: " + (issue.fix || "请重新上传该图片"));
    });
    return "[ASSET CHECK FAILED]\n" + issues.slice(0, 5).map(function (issue) {
      return [
        "productId: " + (issue.productId || "N/A"),
        "productName: " + (issue.productName || "N/A"),
        "field: " + (issue.field || "N/A"),
        "path: " + (issue.path || "N/A"),
        "reason: " + (issue.reason || issue.type || "unknown"),
        "fix: " + (issue.fix || "请重新上传该图片"),
      ].join("\n");
    }).join("\n\n") + (issues.length > 5 ? "\n\n共 " + issues.length + " 项问题，请查看控制台完整清单。" : "");
  }

  async function runAssetPreflight(operation) {
    const connected = await probeSaveHelper();
    if (!connected) {
      return null;
    }
    setHelperStatus("正在检查图片资源...", true);
    const response = await fetch(SAVE_HELPER_URL + "/preflight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: configText(), operation: operation || "export" }),
    });
    const result = await response.json();
    if (!result.ok) {
      const message = formatAssetIssues(result) || result.error || "图片资源检查失败";
      console.error("[ASSET CHECK FAILED]", result.assetReport || result);
      alert(message);
      setHelperStatus("发现图片问题，请查看详情", false);
      throw new Error(message);
    }
    if (result.repairedContent && result.repairedContent !== configText()) {
      applyRepairedConfig(result.repairedContent);
    }
    console.log("[ASSET CHECK PASSED] 所有图片资源检查通过", result.assetReport || {});
    setHelperStatus("图片资源安全，可以保存/导出", true);
    return result;
  }

  function captureEditorScrollState() {
    const body = document.querySelector(".huan-editor-body");
    pendingEditorScrollTop = body ? body.scrollTop : null;
  }

  function restoreEditorScrollState() {
    const body = document.querySelector(".huan-editor-body");
    if (!body || pendingEditorScrollTop === null) {
      return;
    }
    body.scrollTop = pendingEditorScrollTop;
    pendingEditorScrollTop = null;
  }

  function captureWindowScrollState() {
    return {
      x: window.scrollX || window.pageXOffset || 0,
      y: window.scrollY || window.pageYOffset || 0,
    };
  }

  function restoreWindowScrollState(position) {
    if (!position) {
      return;
    }
    function restore() {
      window.scrollTo(position.x, position.y);
    }
    restore();
    window.requestAnimationFrame(restore);
    window.setTimeout(restore, 80);
  }

  function syncActiveProductCatalogFromState() {
    const productId = state.tertiary && (state.tertiary.activeProductId || activeProductId);
    if (!productId || !state.tertiary.productCatalog || !state.tertiary.productCatalog[productId]) {
      return;
    }
    state.tertiary.productCatalog[productId] = {
      gallery: clone(state.tertiary.gallery || []),
      modelCards: clone(state.tertiary.modelCards || []),
      detailImages: clone(state.tertiary.detailImages || []),
      slices: clone(state.tertiary.slices || []),
    };
  }

  function pushHistory() {
    undoStack.push(clone(state));
    if (undoStack.length > HISTORY_LIMIT) {
      undoStack.shift();
    }
    redoStack.length = 0;
  }

  function applyChange(mutator, options) {
    const settings = Object.assign({ rebuildEditor: false, renderOnly: false }, options);
    const windowScroll = captureWindowScrollState();
    pushHistory();
    if (settings.rebuildEditor && isEditorOpen) {
      captureEditorScrollState();
    }
    mutator(state);
    syncActiveProductCatalogFromState();
    normalizeConfig(state);
    renderSite();
    if (settings.rebuildEditor && isEditorOpen) {
      buildEditor();
    }
    restoreWindowScrollState(windowScroll);
    updateActionState();
  }

  function restoreSnapshot(snapshot) {
    const windowScroll = captureWindowScrollState();
    if (isEditorOpen) {
      captureEditorScrollState();
    }
    Object.keys(state).forEach((key) => delete state[key]);
    mergeConfig(state, clone(snapshot));
    syncActiveProductCatalogFromState();
    normalizeConfig(state);
    renderSite();
    if (isEditorOpen) {
      buildEditor();
    }
    restoreWindowScrollState(windowScroll);
    updateActionState();
  }

  function undoChange() {
    if (!undoStack.length) {
      return;
    }
    redoStack.push(clone(state));
    const snapshot = undoStack.pop();
    restoreSnapshot(snapshot);
  }

  function redoChange() {
    if (!redoStack.length) {
      return;
    }
    undoStack.push(clone(state));
    const snapshot = redoStack.pop();
    restoreSnapshot(snapshot);
  }

  function get(path) {
    return path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), state);
  }

  function updateValue(path, value, options) {
    const settings = Object.assign({ rebuildEditor: false }, options);
    currentFieldPath = path;
    applyChange((draft) => {
      const parts = path.split(".");
      const last = parts.pop();
      const target = parts.reduce((obj, key) => obj[key], draft);
      target[last] = value;
    }, settings);
  }

  function resetPath(path) {
    const fallback = path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), normalizeConfig(clone(defaultConfig)));
    if (typeof fallback === "undefined") {
      return;
    }
    updateValue(path, clone(fallback), { rebuildEditor: true });
  }

  function imageValueSrc(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value.src || "";
    }
    return typeof value === "string" ? value : "";
  }

  function firstAvailableDetailImage(productId) {
    const catalog = (state.tertiary && state.tertiary.productCatalog) || {};
    const detail = (catalog[productId] && catalog[productId].detailImages) || state.tertiary.detailImages || [];
    const found = detail.find((item) => imageValueSrc(item));
    if (found) {
      return clone(found);
    }
    const gallery = (catalog[productId] && catalog[productId].gallery) || state.tertiary.gallery || [];
    const firstGallery = gallery[0] && (gallery[0].image || gallery[0].src || gallery[0]);
    return firstGallery && imageValueSrc(firstGallery) ? clone(firstGallery) : null;
  }

  function hideMissingImage(node) {
    const card = node && node.closest && node.closest(".pdd-detail-card");
    if (card) {
      card.hidden = true;
      return;
    }
    if (node) {
      node.hidden = true;
    }
  }

  function handleManagedImageError(node) {
    if (!node) {
      return;
    }
    const badSrc = node.getAttribute("src") || node.src || "";
    console.warn("[IMAGE MISSING]", badSrc);
    if (node.dataset.huanFallbackApplied) {
      hideMissingImage(node);
      return;
    }
    const page = node.closest && node.closest(".product-detail-page");
    const productId = (page && page.dataset && page.dataset.productId) || getActiveProductId();
    const fallback = firstAvailableDetailImage(productId) || placeholderImage;
    const fallbackSrc = imageValueSrc(fallback);
    if (fallbackSrc && fallbackSrc !== badSrc) {
      node.dataset.huanFallbackApplied = "1";
      applyManagedImage(node, fallback);
      return;
    }
    hideMissingImage(node);
  }

  function applyManagedImage(node, imageValue) {
    if (!node || !imageValue) {
      return;
    }
    node.hidden = false;
    const parentCard = node.closest && node.closest(".pdd-detail-card");
    if (parentCard) {
      parentCard.hidden = false;
    }
    node.onload = function () {
      delete node.dataset.huanFallbackApplied;
      fitManagedImage(node);
    };
    node.onerror = function () {
      handleManagedImageError(node);
    };
    node.src = imageValueSrc(imageValue);
    node.dataset.huanManagedImage = imageValue.isUploaded ? "uploaded" : "static";
    node.style.setProperty("--huan-image-scale", String(imageValue.scale || 1));
    node.style.setProperty("--huan-object-position", (imageValue.offsetX || 50) + "% " + (imageValue.offsetY || 50) + "%");
    node.style.setProperty("--huan-offset-x", String(imageValue.offsetX || 50));
    node.style.setProperty("--huan-offset-y", String(imageValue.offsetY || 50));
    fitManagedImage(node);
  }

  function managedImageFrameSize(node) {
    const parent = node && node.parentElement;
    if (!parent) {
      return { width: 1, height: 1 };
    }
    const rect = parent.getBoundingClientRect();
    if (parent.classList && parent.classList.contains("slice")) {
      const copy = parent.querySelector(".slice-copy");
      const copyRect = copy && copy.getBoundingClientRect ? copy.getBoundingClientRect() : null;
      const imageWidth = copyRect && copyRect.width ? rect.width - copyRect.width : rect.width * 0.59;
      return { width: Math.max(imageWidth, 1), height: Math.max(rect.height, 1) };
    }
    return { width: Math.max(rect.width, 1), height: Math.max(rect.height, 1) };
  }

  function fitManagedImage(node) {
    if (!node || node.tagName !== "IMG" || !node.naturalWidth || !node.naturalHeight) {
      return;
    }
    if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains("pdd-detail-card")) {
      node.dataset.huanFit = "natural";
      node.style.setProperty("position", "static", "important");
      node.style.setProperty("left", "auto", "important");
      node.style.setProperty("top", "auto", "important");
      node.style.setProperty("width", "100%", "important");
      node.style.setProperty("height", "auto", "important");
      node.style.setProperty("max-width", "100%", "important");
      node.style.setProperty("max-height", "none", "important");
      node.style.setProperty("object-fit", "contain", "important");
      node.style.setProperty("object-position", "center top", "important");
      node.style.setProperty("margin", "0", "important");
      node.style.setProperty("padding", "0", "important");
      return;
    }
    const frame = managedImageFrameSize(node);
    const imageRatio = node.naturalWidth / node.naturalHeight;
    const frameRatio = frame.width / frame.height;
    const fit = imageRatio <= frameRatio ? "width" : "height";
    const isSliceImage = node.parentElement && node.parentElement.classList && node.parentElement.classList.contains("slice");
    node.dataset.huanFit = fit;
    node.style.setProperty("object-fit", "fill", "important");
    node.style.setProperty("object-position", "center center", "important");
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("max-height", "none", "important");
    node.style.setProperty("margin", "0", "important");
    node.style.setProperty("padding", "0", "important");
    if (isSliceImage) {
      node.style.setProperty("position", "relative", "important");
      node.style.setProperty("left", "auto", "important");
      node.style.setProperty("top", "auto", "important");
      node.style.setProperty("align-self", "center", "important");
      node.style.setProperty("justify-self", "center", "important");
      node.style.setProperty("width", "100%", "important");
      node.style.setProperty("height", "auto", "important");
      node.style.setProperty("aspect-ratio", "1.55 / 1", "important");
      node.style.setProperty("object-fit", "cover", "important");
      return;
    } else {
      node.style.setProperty("position", "absolute", "important");
      node.style.setProperty("left", "50%", "important");
      node.style.setProperty("top", "50%", "important");
    }
    if (fit === "width") {
      node.style.setProperty("width", "100%", "important");
      node.style.setProperty("height", "auto", "important");
    } else {
      node.style.setProperty("width", "auto", "important");
      node.style.setProperty("height", "100%", "important");
    }
  }

  function fitAllManagedImages(root) {
    (root || document).querySelectorAll("img[data-huan-managed-image]").forEach((node) => {
      if (node.complete && node.naturalWidth && node.naturalHeight) {
        fitManagedImage(node);
        return;
      }
      if (!node.dataset.huanFitOnLoad) {
        node.dataset.huanFitOnLoad = "1";
        node.addEventListener("load", function () {
          fitManagedImage(node);
        });
      }
      if (!node.dataset.huanMissingHandler) {
        node.dataset.huanMissingHandler = "1";
        node.addEventListener("error", function () {
          handleManagedImageError(node);
        });
      }
      if (node.complete && !node.naturalWidth) {
        handleManagedImageError(node);
      }
    });
  }

  function renderProductSlices(section, slices) {
    if (!section) {
      return;
    }
    section.innerHTML = "";
    slices.slice(0, 3).forEach((item) => {
      const slice = document.createElement("div");
      slice.className = "slice model-showcase";
      slice.innerHTML = '<div class="slice-copy"><h2></h2><p></p></div><img alt="">';
      text("h2", item.title || "", slice);
      text("p", item.desc || "", slice);
      applyManagedImage(slice.querySelector("img"), item.image);
      section.appendChild(slice);
    });
    const longItem = slices[3];
    if (longItem) {
      const longBlock = document.createElement("div");
      longBlock.className = "long-img";
      longBlock.innerHTML = '<img alt="LUMIVISTA detail long image">';
      applyManagedImage(longBlock.querySelector("img"), longItem.image);
      section.appendChild(longBlock);
    }
  }

  function renderProductEditorial(page, product) {
    const section = page && page.querySelector(".product-editorial");
    if (!section || !product) {
      return;
    }
    const kicker = section.querySelector("p");
    if (kicker) {
      kicker.textContent = "PRODUCT NOTE";
    }
    text("h2", product.story || "", section);
    const copy = section.querySelector("div > p");
    if (copy) {
      copy.textContent = product.intro || "";
    }
    section.hidden = !(product.story || product.intro);
  }

  function ensureImageLightbox() {
    let lightbox = document.querySelector(".huan-lightbox");
    if (lightbox) {
      return lightbox;
    }
    lightbox = document.createElement("div");
    lightbox.className = "huan-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = '<button class="huan-lightbox-close" type="button" aria-label="Close preview">×</button><img alt="">';
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.classList.contains("huan-lightbox-close")) {
        closeImageLightbox();
      }
    });
    document.body.appendChild(lightbox);
    return lightbox;
  }

  function openImageLightbox(src, alt) {
    if (!src) {
      return;
    }
    const lightbox = ensureImageLightbox();
    const image = lightbox.querySelector("img");
    image.src = src;
    image.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("huan-lightbox-open");
  }

  function closeImageLightbox() {
    const lightbox = document.querySelector(".huan-lightbox");
    if (!lightbox) {
      return;
    }
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("huan-lightbox-open");
  }

  function bindImageLightbox() {
    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest(".product-detail-page .detail-card, .product-detail-page .pdd-detail-card img, .product-detail-page .slice > img")
        : null;
      const image = target && target.matches(".detail-card") ? target.querySelector("img") : target;
      if (!image) {
        return;
      }
      event.preventDefault();
      openImageLightbox(image.currentSrc || image.src, image.alt || "");
    });
  }

  function managedImageSrc(imageValue) {
    if (imageValue && typeof imageValue === "object" && !Array.isArray(imageValue)) {
      return imageValue.src || "";
    }
    return typeof imageValue === "string" ? imageValue : "";
  }

  var PRODUCT_ID_PATTERN = /(1003|1008|3009|3605|3623|6316|9956|9957|9963)/;

  function productIdFromFileName(src) {
    var fileName = String(src || "").replace(/\\/g, "/").split("/").pop() || "";
    var match = fileName.match(PRODUCT_ID_PATTERN);
    return match ? match[1] : "";
  }

  function productIdFromPath(src) {
    var match = String(src || "").match(/(?:^|[\/\\-])(1003|1008|3009|3605|3623|6316|9956|9957|9963)(?=[\/\\-]|$)/);
    return match ? match[1] : "";
  }

  function extractProductIdFromImage(imageValue) {
    var src = managedImageSrc(imageValue);
    return productIdFromFileName(src) || productIdFromPath(src);
  }

  function homeProductId(item) {
    return extractProductIdFromImage(item && item.image) || (item && item.productId) || "";
  }

  function text(selector, value, root) {
    const node = (root || document).querySelector(selector);
    if (node && typeof value === "string") {
      node.textContent = value;
    }
  }

  function formattedCaption(selector, value, root, options) {
    const node = (root || document).querySelector(selector);
    if (!node || typeof value !== "string") {
      return;
    }
    const lines = value.split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
    if (!lines.length) {
      node.textContent = "";
      return;
    }
    if (options && options.plain) {
      node.textContent = lines.join(" ");
      return;
    }
    node.textContent = "";
    const title = document.createElement("span");
    title.className = "caption-en";
    title.textContent = lines[0];
    node.appendChild(title);
    if (lines.length > 1) {
      const desc = document.createElement("span");
      desc.className = "caption-cn";
      desc.textContent = lines.slice(1).join(" ");
      node.appendChild(desc);
    }
  }

  function bindHomeProductClick(node, productId) {
    if (!node || !productId) {
      return;
    }
    node.dataset.productId = productId;
    node.onclick = function () {
      window.showProductDetail(productId);
    };
  }

  function renderSite() {
    renderStaticContent();
    renderSecondaryProducts();
    renderProductGallery();
    renderModelCards();
    renderDetailImages();
    fitAllManagedImages();
  }

  function renderStaticContent() {
    const activeHeroButton = document.querySelector(".hero-bars button.active");
    const activeHeroIndex = Number(activeHeroButton && activeHeroButton.dataset.slide ? activeHeroButton.dataset.slide : 0);
    const activeHeroSlide = state.home.heroSlides[activeHeroIndex] || state.home.heroSlides[0] || {};
    formattedCaption(".home-hero .hero-copy p", activeHeroSlide.caption || state.home.heroCaption, null, { plain: true });

    document.querySelectorAll(".home-hero .hero-slide").forEach((slide, index) => {
      const item = state.home.heroSlides[index];
      if (!item) {
        return;
      }
      slide.dataset.caption = item.caption || state.home.heroCaption || "";
      const video = slide.querySelector("video");
      const img = slide.querySelector("img");
      if (item.type === "video" && video) {
        const source = video.querySelector("source");
        const nextPoster = item.poster || "";
        const shouldReload = (source && source.getAttribute("src") !== item.src) || video.getAttribute("poster") !== nextPoster;
        if (shouldReload) {
          if (source) {
            source.src = item.src;
          }
          video.poster = nextPoster;
          video.load();
        }
      }
      if (item.type === "image" && img) {
        const imageValue = item.src;
        const nextSrc = imageValue && imageValue.src ? imageValue.src : "";
        const currentSrc = img.getAttribute("src") || "";
        if (currentSrc !== nextSrc) {
          applyManagedImage(img, imageValue);
        } else if (imageValue) {
          img.dataset.huanManagedImage = imageValue.isUploaded ? "uploaded" : "static";
          img.style.setProperty("--huan-image-scale", String(imageValue.scale || 1));
          img.style.setProperty("--huan-object-position", (imageValue.offsetX || 50) + "% " + (imageValue.offsetY || 50) + "%");
          img.style.setProperty("--huan-offset-x", String(imageValue.offsetX || 50));
          img.style.setProperty("--huan-offset-y", String(imageValue.offsetY || 50));
        }
      }
    });

    document.querySelectorAll(".activity-card").forEach((card, index) => {
      const item = state.home.categories[index];
      if (!item) {
        return;
      }
      applyManagedImage(card.querySelector("img"), item.image);
      text("h3", item.title, card);
      text("p", item.cta || "Shop Now \u2192", card);
      bindHomeProductClick(card, homeProductId(item));
    });

    document.querySelectorAll(".story-card").forEach((card, index) => {
      const item = state.home.stories[index];
      if (!item) {
        return;
      }
      applyManagedImage(card.querySelector("img"), item.image);
      text("h3", item.title, card);
      text("p", item.desc, card);
      bindHomeProductClick(card, homeProductId(item));
    });

    formattedCaption(".trend-carousel .trend-copy p", state.home.sceneCaption);
    const trendCarousel = document.querySelector(".trend-carousel");
    if (trendCarousel) {
      trendCarousel.onclick = function (event) {
        if (event.target.closest(".trend-carousel-dots")) {
          return;
        }
        const activeButton = trendCarousel.querySelector(".trend-carousel-dots button.active");
        const index = Number((activeButton && activeButton.dataset.trendSlide) || 0);
        const slide = trendCarousel.querySelectorAll(".trend-carousel-slide")[index];
        const productId = slide && slide.dataset.productId;
        if (productId) {
          window.showProductDetail(productId);
        }
      };
    }
    document.querySelectorAll(".trend-carousel-slide").forEach((slide, index) => {
      const item = state.home.sceneSlides[index];
      if (item) {
        applyManagedImage(slide.querySelector("img"), item.image);
        slide.dataset.productId = homeProductId(item);
      }
    });
    if (typeof window.HUAN_RESTART_TREND_CAROUSEL === "function") {
      window.HUAN_RESTART_TREND_CAROUSEL();
    }

    document.querySelectorAll(".refined-products .product").forEach((card, index) => {
      const item = state.home.visualProducts[index];
      if (!item) {
        return;
      }
      applyManagedImage(card.querySelector("img"), item.image);
      text("h3", item.title, card);
      text("p", item.desc, card);
      bindHomeProductClick(card, homeProductId(item));
    });

    document.querySelectorAll(".journal-panel").forEach((panel, index) => {
      const item = state.home.journalPanels[index];
      if (!item) {
        return;
      }
      applyManagedImage(panel.querySelector("img"), item.image);
      text("h2", item.title, panel);
      bindHomeProductClick(panel, homeProductId(item));
    });

    document.querySelectorAll(".secondary-page").forEach((page) => {
      const group = page.dataset.secondaryGroup || "all";
      const meta = (state.secondary.pages && state.secondary.pages[group]) || {};
      const head = page.querySelector(".page-head > div");
      if (!head) {
        return;
      }
      const ps = head.querySelectorAll("p");
      if (ps[0]) {
        ps[0].textContent = meta.eyebrow || state.secondary.eyebrow;
      }
      text("h1", meta.title || state.secondary.title, head);
      if (ps[1]) {
        ps[1].textContent = meta.desc || state.secondary.desc;
      }
    });

    state.secondary.products.forEach((product) => {
      const page = getTertiaryPage(product.productId);
      if (!page) {
        return;
      }
      renderTertiaryHead(page, product);
      const catalogProduct = state.tertiary.productCatalog && state.tertiary.productCatalog[product.productId];
      renderProductEditorial(page, catalogProduct);
    });

    document.querySelectorAll(".product-detail-page .detail-slices").forEach((section) => {
      const page = section.closest(".product-detail-page");
      const productId = page && page.dataset ? page.dataset.productId : "";
      const product = productId && state.tertiary.productCatalog ? state.tertiary.productCatalog[productId] : null;
      const slices = product && product.slices && product.slices.length ? product.slices : state.tertiary.slices;
      renderProductSlices(section, slices || []);
    });
  }

  function renderSecondaryProducts() {
    const grid = document.querySelector("#secondary .listing-grid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    const groups = state.controllerGroups && state.controllerGroups.secondary;
    const groupedIds = groups ? [].concat(groups.women || [], groups.men || [], groups.kids || []) : [];
    const products = groupedIds.length
      ? groupedIds.map((id) => state.secondary.products.find((item) => item.productId === id)).filter(Boolean)
      : state.secondary.products;
    products.forEach((item) => {
      const card = document.createElement("div");
      card.className = "listing-card";
      card.onclick = function () {
        window.showProductDetail(item.productId, "secondary");
      };
      card.innerHTML = '<div class="listing-img"><img></div><div class="listing-tag"></div><div class="listing-title"></div><div class="listing-desc"></div>';
      applyManagedImage(card.querySelector("img"), item.image);
      text(".listing-tag", item.tag, card);
      text(".listing-title", item.title, card);
      text(".listing-desc", item.desc, card);
      grid.appendChild(card);
    });
  }

  function setActiveProductDetail(productId) {
    const catalog = state.tertiary.productCatalog || {};
    const detail = catalog[productId];
    if (!detail) {
      return false;
    }
    const product = state.secondary.products.find((item) => item.productId === productId) || {};
    activeProductId = productId;
    state.tertiary.activeProductId = productId;
    if (product.title) {
      state.tertiary.title = product.title;
    }
    if (product.desc) {
      state.tertiary.desc = product.desc;
    }
    state.tertiary.eyebrow = product.tag || "PRODUCT DETAIL PAGE";
    state.tertiary.gallery = clone(detail.gallery);
    state.tertiary.modelCards = clone(detail.modelCards);
    state.tertiary.detailImages = clone(detail.detailImages);
    state.tertiary.slices = clone(detail.slices || state.tertiary.slices || []);
    currentProductIndex = 0;
    if (state.tertiary.gallery.length) {
      state.tertiary.mainImage = state.tertiary.gallery[0].image.src;
    }
    return true;
  }

  function getActiveProductId() {
    return state.tertiary.activeProductId || activeProductId || "1003";
  }

  function getTertiaryPage(productId) {
    const id = productId || getActiveProductId();
    return document.getElementById("tertiary-" + id) || document.getElementById("tertiary");
  }

  function renderTertiaryHead(page, product) {
    const head = page && page.querySelector(".page-head > div");
    if (!head || !product) {
      return;
    }
    const ps = head.querySelectorAll("p");
    if (ps[0]) {
      ps[0].textContent = product.tag || "PRODUCT DETAIL PAGE";
    }
    text("h1", product.title || "", head);
    if (ps[1]) {
      ps[1].textContent = product.desc || "";
    }
  }

  function renderProductGallery() {
    const productId = getActiveProductId();
    const page = getTertiaryPage(productId);
    const column = page && page.querySelector(".thumb-column");
    if (!column) {
      return;
    }
    column.innerHTML = "";
    if (currentProductIndex >= state.tertiary.gallery.length) {
      currentProductIndex = state.tertiary.gallery.length - 1;
    }
    if (currentProductIndex < 0) {
      currentProductIndex = 0;
    }

    state.tertiary.gallery.forEach((item, index) => {
      const thumb = document.createElement("div");
      thumb.className = "thumb-item" + (index === currentProductIndex ? " active" : "");
      thumb.innerHTML = "<img>";
      applyManagedImage(thumb.querySelector("img"), item.thumb);
      thumb.addEventListener("mouseenter", function () {
        window.changeProductImage(productId, index);
      });
      thumb.addEventListener("click", function () {
        window.changeProductImage(productId, index);
      });
      column.appendChild(thumb);
    });

    const mainImage = page.querySelector("[data-main-product-image]") || document.getElementById("mainProductImage-" + productId) || document.getElementById("mainProductImage");
    if (mainImage) {
      const active = state.tertiary.gallery[currentProductIndex];
      applyManagedImage(mainImage, active.image);
      state.tertiary.mainImage = active.image.src;
    }
  }

  function renderModelCards() {
    const page = getTertiaryPage();
    const grid = page && page.querySelector(".detail-grid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    state.tertiary.modelCards.forEach((item) => {
      const card = document.createElement("div");
      card.className = "detail-card";
      card.innerHTML = "<img><h3></h3>";
      applyManagedImage(card.querySelector("img"), item.image);
      text("h3", item.title, card);
      grid.appendChild(card);
    });
  }

  function renderDetailImages() {
    const page = getTertiaryPage();
    const inner = page && page.querySelector(".pdd-detail-inner");
    if (!inner) {
      return;
    }
    inner.innerHTML = "";
    state.tertiary.detailImages.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "pdd-detail-card";
      figure.innerHTML = '<img alt="Product detail section ' + String(index + 1).padStart(2, "0") + '">';
      applyManagedImage(figure.querySelector("img"), item);
      inner.appendChild(figure);
    });
  }

  function replaceArrayItem(arrayPath, index, nextValue) {
    currentFieldPath = arrayPath + "." + index;
    applyChange((draft) => {
      getDraftArray(draft, arrayPath)[index] = nextValue;
    });
  }

  function getDraftArray(draft, arrayPath) {
    return arrayPath.split(".").reduce((obj, key) => obj[key], draft);
  }

  function createButton(label, className, onClick) {
    const node = document.createElement("button");
    node.type = "button";
    node.textContent = label;
    if (className) {
      node.className = className;
    }
    if (onClick) {
      node.addEventListener("click", onClick);
    }
    return node;
  }

  function createEditor() {
    const editor = document.createElement("aside");
    editor.className = "huan-editor";
    editor.innerHTML = [
      '<div class="huan-editor-head">',
      '<div>',
      '<h2 class="huan-editor-title">HUAN 内容控制面板</h2>',
      '<p class="huan-editor-sub">Ctrl+E 开关面板。图片支持路径、上传、缩放和位置微调。</p>',
      '<p class="huan-editor-status" data-save-status>未连接保存助手</p>',
      "</div>",
      '<div class="huan-editor-head-actions">',
      '<button type="button" class="huan-editor-close" aria-label="关闭">×</button>',
      "</div>",
      "</div>",
      '<div class="huan-editor-tabs">',
      '<button type="button" data-tab="home">首页</button>',
      '<button type="button" data-tab="secondary">二级页</button>',
      '<button type="button" data-tab="tertiary">详情页</button>',
      "</div>",
      '<div class="huan-editor-toolbar">',
      '<button type="button" data-action="undo">撤销</button>',
      '<button type="button" data-action="redo">恢复</button>',
      '<button type="button" data-action="save" class="primary">保存</button>',
      '<button type="button" data-action="preview-config">查看配置</button>',
      '<button type="button" data-action="reset-current">重置当前项</button>',
      '<button type="button" data-action="reset-all">恢复默认</button>',
      "</div>",
      '<div class="huan-editor-body"></div>',
      '<div class="huan-editor-resize huan-editor-resize-right" data-resize="right" aria-hidden="true"></div>',
      '<div class="huan-editor-resize huan-editor-resize-bottom" data-resize="bottom" aria-hidden="true"></div>',
      '<div class="huan-editor-resize huan-editor-resize-corner" data-resize="corner" aria-hidden="true"></div>',
    ].join("");
    document.body.appendChild(editor);

    const hint = document.createElement("div");
    hint.className = "huan-edit-toggle-hint";
    hint.textContent = "编辑模式 Ctrl+E";
    document.body.appendChild(hint);

    const exportBox = document.createElement("div");
    exportBox.className = "huan-export-box";
    exportBox.innerHTML =
      '<div class="huan-export-head"><h3>huan-config.js</h3><button type="button" data-export-close>关闭</button></div><textarea spellcheck="false"></textarea><div class="huan-export-actions"><button type="button" data-export-copy>复制</button></div>';
    document.body.appendChild(exportBox);

    editor.querySelector(".huan-editor-close").addEventListener("click", toggleEditor);
    editor.querySelectorAll("[data-tab]").forEach((node) => {
      node.addEventListener("click", function () {
        activeTab = node.dataset.tab;
        buildEditor();
      });
    });
    editor.querySelector("[data-action='undo']").addEventListener("click", undoChange);
    editor.querySelector("[data-action='redo']").addEventListener("click", redoChange);
    editor.querySelector("[data-action='save']").addEventListener("click", function () {
      saveConfig().catch(function () {});
    });
    editor.querySelector("[data-action='preview-config']").addEventListener("click", function () {
      openExport().catch(function () {});
    });
    editor.querySelector("[data-action='reset-current']").addEventListener("click", function () {
      if (currentFieldPath) {
        resetPath(currentFieldPath);
      }
    });
    editor.querySelector("[data-action='reset-all']").addEventListener("click", function () {
      applyChange((draft) => {
        Object.keys(draft).forEach((key) => delete draft[key]);
        mergeConfig(draft, clone(defaultConfig));
      }, { rebuildEditor: true });
    });

    exportBox.querySelector("[data-export-close]").addEventListener("click", function () {
      exportBox.classList.remove("active");
    });
    exportBox.querySelector("[data-export-copy]").addEventListener("click", function () {
      copyConfig().catch(function () {});
    });

    bindPanelInteractions(editor);
    resetPanelFrame();
    updateActionState();
  }

  function bindPanelInteractions(editor) {
    const head = editor.querySelector(".huan-editor-head");
    head.addEventListener("mousedown", function (event) {
      if (event.button !== 0) {
        return;
      }
      if (event.target.closest("button, input, textarea, select, label, a")) {
        return;
      }
      const rect = editor.getBoundingClientRect();
      dragState = {
        startX: event.clientX,
        startY: event.clientY,
        frame: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
      };
      event.preventDefault();
    });
    head.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });

    editor.querySelectorAll("[data-resize]").forEach((handle) => {
      handle.addEventListener("mousedown", function (event) {
        if (event.button !== 0) {
          return;
        }
        const rect = editor.getBoundingClientRect();
        resizeState = {
          mode: handle.dataset.resize,
          startX: event.clientX,
          startY: event.clientY,
          frame: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
        };
        event.preventDefault();
      });
    });

    document.addEventListener("mousemove", function (event) {
      if (dragState) {
        panelFrame = clampPanelFrame({
          x: dragState.frame.x + (event.clientX - dragState.startX),
          y: dragState.frame.y + (event.clientY - dragState.startY),
          width: dragState.frame.width,
          height: dragState.frame.height,
        });
        applyPanelFrame();
      }
      if (resizeState) {
        const nextFrame = {
          x: resizeState.frame.x,
          y: resizeState.frame.y,
          width: resizeState.frame.width,
          height: resizeState.frame.height,
        };
        if (resizeState.mode === "right" || resizeState.mode === "corner") {
          nextFrame.width = resizeState.frame.width + (event.clientX - resizeState.startX);
        }
        if (resizeState.mode === "bottom" || resizeState.mode === "corner") {
          nextFrame.height = resizeState.frame.height + (event.clientY - resizeState.startY);
        }
        panelFrame = clampPanelFrame(nextFrame);
        applyPanelFrame();
      }
    }, true);

    function stopPanelInteraction() {
      dragState = null;
      resizeState = null;
    }

    document.addEventListener("mouseup", stopPanelInteraction, true);
    document.addEventListener("mouseleave", stopPanelInteraction, true);
    window.addEventListener("blur", stopPanelInteraction);

    window.addEventListener("resize", function () {
      if (!isEditorOpen) {
        return;
      }
      panelFrame = clampPanelFrame(panelFrame || getDefaultPanelFrame());
      applyPanelFrame();
    });
  }

  function updateActionState() {
    const editor = document.querySelector(".huan-editor");
    if (!editor) {
      return;
    }
    const undoButton = editor.querySelector("[data-action='undo']");
    const redoButton = editor.querySelector("[data-action='redo']");
    const saveButton = editor.querySelector("[data-action='save']");
    const statusNode = editor.querySelector("[data-save-status]");
    if (undoButton) {
      undoButton.disabled = undoStack.length === 0;
    }
    if (redoButton) {
      redoButton.disabled = redoStack.length === 0;
    }
    if (saveButton) {
      saveButton.disabled = !helperConnected;
    }
    if (statusNode) {
      statusNode.textContent = helperMessage;
      statusNode.classList.toggle("is-connected", helperConnected);
    }
  }

  function toggleEditor() {
    isEditorOpen = !isEditorOpen;
    document.body.classList.toggle("huan-editing", isEditorOpen);
    if (isEditorOpen) {
      resetPanelFrame();
      buildEditor();
      probeSaveHelper();
      clearInterval(statusTimer);
      statusTimer = window.setInterval(probeSaveHelper, 6000);
    } else {
      clearInterval(statusTimer);
      dragState = null;
      resizeState = null;
    }
  }

  function buildEditor() {
    const editor = document.querySelector(".huan-editor");
    if (!editor) {
      return;
    }
    editor.querySelectorAll("[data-tab]").forEach((node) => {
      node.classList.toggle("active", node.dataset.tab === activeTab);
    });
    const body = editor.querySelector(".huan-editor-body");
    body.innerHTML = "";
    if (activeTab === "home") {
      buildHome(body);
    }
    if (activeTab === "secondary") {
      buildSecondary(body);
    }
    if (activeTab === "tertiary") {
      buildTertiary(body);
    }
    restoreEditorScrollState();
    updateActionState();
  }

  function group(parent, title, open) {
    const details = document.createElement("details");
    details.className = "huan-editor-group";
    details.open = !!open;
    details.innerHTML = "<summary>" + title + "</summary><div class='huan-editor-fields'></div>";
    parent.appendChild(details);
    return details.querySelector(".huan-editor-fields");
  }

  function item(parent, title) {
    const box = document.createElement("div");
    box.className = "huan-editor-item";
    box.innerHTML = "<p class='huan-editor-item-title'>" + title + "</p>";
    parent.appendChild(box);
    return box;
  }

  function textField(parent, label, path, multiline) {
    const wrap = document.createElement("div");
    wrap.className = "huan-field";
    wrap.innerHTML = "<label>" + label + "</label>" + (multiline ? "<textarea></textarea>" : "<input type='text'>");
    const input = wrap.querySelector(multiline ? "textarea" : "input");
    input.value = get(path) || "";
    input.addEventListener("focus", function () {
      currentFieldPath = path;
    });
    input.addEventListener("input", function () {
      updateValue(path, input.value, { rebuildEditor: false });
    });
    parent.appendChild(wrap);
  }

  function numericField(parent, label, value, min, max, step, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "huan-field";
    wrap.innerHTML =
      "<label>" +
      label +
      "</label><div class='huan-slider-row'><input type='range' min='" +
      min +
      "' max='" +
      max +
      "' step='" +
      step +
      "'><input type='number' min='" +
      min +
      "' max='" +
      max +
      "' step='" +
      step +
      "'></div>";
    const range = wrap.querySelector("input[type='range']");
    const number = wrap.querySelector("input[type='number']");
    range.value = value;
    number.value = value;
    function sync(nextValue) {
      range.value = String(nextValue);
      number.value = String(nextValue);
      onChange(Number(nextValue));
    }
    range.addEventListener("input", function () {
      sync(range.value);
    });
    number.addEventListener("input", function () {
      sync(number.value);
    });
    parent.appendChild(wrap);
  }

  function imageField(parent, label, path) {
    const wrap = document.createElement("div");
    const imageValue = get(path);
    wrap.className = "huan-field";
    wrap.innerHTML =
      "<label>" +
      label +
      "</label><div class='huan-image-row'><input type='text'><span class='huan-upload'>上传<input type='file' accept='image/*,video/mp4'></span></div>";
    const input = wrap.querySelector("input[type='text']");
    const file = wrap.querySelector("input[type='file']");
    input.value = imageValue.src || "";
    input.addEventListener("focus", function () {
      currentFieldPath = path;
    });
    input.addEventListener("input", function () {
      const next = Object.assign({}, get(path), {
        src: input.value,
        scale: 1,
        offsetX: 50,
        offsetY: 50,
        isUploaded: false,
      });
      updateValue(path, next, { rebuildEditor: false });
    });
    input.addEventListener("change", function () {
      const next = Object.assign({}, get(path), {
        src: input.value,
        scale: 1,
        offsetX: 50,
        offsetY: 50,
        isUploaded: false,
      });
      updateValue(path, next, { rebuildEditor: true });
    });
    file.addEventListener("change", function () {
      const selected = file.files && file.files[0];
      if (!selected) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        const current = get(path) || {};
        const next = Object.assign({}, current, {
          src: reader.result,
          scale: clampNumber(current.scale, 1, 0.5, 3),
          offsetX: clampNumber(current.offsetX, 50, 0, 100),
          offsetY: clampNumber(current.offsetY, 50, 0, 100),
          isUploaded: true,
        });
        input.value = reader.result;
        updateValue(path, next, { rebuildEditor: true });
      };
      reader.readAsDataURL(selected);
    });
    parent.appendChild(wrap);

    if (imageValue.isUploaded) {
      numericField(parent, "图片缩放", imageValue.scale, 0.5, 3, 0.05, function (nextValue) {
        const next = Object.assign({}, get(path), { scale: clampNumber(nextValue, 1, 0.5, 3), isUploaded: true });
        updateValue(path, next, { rebuildEditor: false });
      });
      numericField(parent, "水平位置", imageValue.offsetX, 0, 100, 1, function (nextValue) {
        const next = Object.assign({}, get(path), { offsetX: clampNumber(nextValue, 50, 0, 100), isUploaded: true });
        updateValue(path, next, { rebuildEditor: false });
      });
      numericField(parent, "垂直位置", imageValue.offsetY, 0, 100, 1, function (nextValue) {
        const next = Object.assign({}, get(path), { offsetY: clampNumber(nextValue, 50, 0, 100), isUploaded: true });
        updateValue(path, next, { rebuildEditor: false });
      });
    }
  }

  function listHeader(parent, label, arrayPath, createFallback) {
    const row = document.createElement("div");
    row.className = "huan-list-head";
    row.innerHTML = "<span>" + label + "</span>";
    row.appendChild(
      createButton("新增一项", "huan-mini primary", function () {
        applyChange((draft) => {
          const list = getDraftArray(draft, arrayPath);
          const source = list.length ? list[list.length - 1] : createFallback();
          list.push(clone(source));
        }, { rebuildEditor: true });
      })
    );
    parent.appendChild(row);
  }

  function listControls(parent, arrayPath, index) {
    const list = get(arrayPath);
    const row = document.createElement("div");
    row.className = "huan-list-controls";

    const copyButton = createButton("复制", "huan-mini", function () {
      applyChange((draft) => {
        const draftList = getDraftArray(draft, arrayPath);
        draftList.splice(index + 1, 0, clone(draftList[index]));
      }, { rebuildEditor: true });
    });

    const upButton = createButton("上移", "huan-mini", function () {
      if (index === 0) {
        return;
      }
      applyChange((draft) => {
        const draftList = getDraftArray(draft, arrayPath);
        const moved = draftList.splice(index, 1)[0];
        draftList.splice(index - 1, 0, moved);
      }, { rebuildEditor: true });
    });
    upButton.disabled = index === 0;

    const downButton = createButton("下移", "huan-mini", function () {
      if (index >= list.length - 1) {
        return;
      }
      applyChange((draft) => {
        const draftList = getDraftArray(draft, arrayPath);
        const moved = draftList.splice(index, 1)[0];
        draftList.splice(index + 1, 0, moved);
      }, { rebuildEditor: true });
    });
    downButton.disabled = index === list.length - 1;

    const deleteButton = createButton("删除", "huan-mini danger", function () {
      if (list.length <= 1) {
        return;
      }
      applyChange((draft) => {
        const draftList = getDraftArray(draft, arrayPath);
        draftList.splice(index, 1);
      }, { rebuildEditor: true });
    });
    deleteButton.disabled = list.length <= 1;

    [copyButton, upButton, downButton, deleteButton].forEach((node) => row.appendChild(node));
    parent.appendChild(row);
  }

  function buildHome(parent) {
    const hero = group(parent, "首页 Hero 轮播", true);
    const heroBox = item(hero, "主标题");
    textField(heroBox, "标题文字", "home.heroCaption");

    state.home.heroSlides.forEach((slide, index) => {
      const box = item(hero, "轮播 " + (index + 1));
      textField(box, "轮播文案", "home.heroSlides." + index + ".caption");
      if (slide.type === "video") {
        const pathWrap = document.createElement("div");
        pathWrap.className = "huan-field";
        pathWrap.innerHTML = "<label>视频路径</label><input type='text'>";
        const input = pathWrap.querySelector("input");
        input.value = slide.src;
        input.addEventListener("input", function () {
          updateValue("home.heroSlides." + index + ".src", input.value, { rebuildEditor: false });
        });
        box.appendChild(pathWrap);
      } else {
        imageField(box, "图片", "home.heroSlides." + index + ".src");
      }
    });

    const categories = group(parent, "产品摄影分类", false);
    state.home.categories.forEach((entry, index) => {
      const box = item(categories, "分类 " + (index + 1));
      textField(box, "标题", "home.categories." + index + ".title");
      textField(box, "Shop Now 文案", "home.categories." + index + ".cta");
      imageField(box, "图片", "home.categories." + index + ".image");
    });

    const stories = group(parent, "故事卡片", false);
    state.home.stories.forEach((entry, index) => {
      const box = item(stories, "故事 " + (index + 1));
      textField(box, "标题", "home.stories." + index + ".title");
      textField(box, "描述", "home.stories." + index + ".desc", true);
      imageField(box, "图片", "home.stories." + index + ".image");
    });

    const scene = group(parent, "场景拍摄轮播", false);
    const sceneTitle = item(scene, "轮播标题");
    textField(sceneTitle, "标题文字", "home.sceneCaption");
    state.home.sceneSlides.forEach((entry, index) => {
      const box = item(scene, "场景图 " + (index + 1));
      imageField(box, "图片", "home.sceneSlides." + index + ".image");
    });

    const products = group(parent, "视觉展示产品", false);
    state.home.visualProducts.forEach((entry, index) => {
      const box = item(products, "产品 " + (index + 1));
      textField(box, "名称", "home.visualProducts." + index + ".title");
      textField(box, "描述", "home.visualProducts." + index + ".desc");
      imageField(box, "图片", "home.visualProducts." + index + ".image");
    });

    const journal = group(parent, "三联图", false);
    state.home.journalPanels.forEach((entry, index) => {
      const box = item(journal, "三联图 " + (index + 1));
      textField(box, "标题", "home.journalPanels." + index + ".title");
      imageField(box, "图片", "home.journalPanels." + index + ".image");
    });
  }

  function buildSecondary(parent) {
    const head = group(parent, "二级页页头", true);
    const headBox = item(head, "页头文字");
    textField(headBox, "小标题", "secondary.eyebrow");
    textField(headBox, "标题", "secondary.title");
    textField(headBox, "描述", "secondary.desc", true);
    ["all", "women", "men", "kids"].forEach(function (key) {
      if (!state.secondary.pages) {
        state.secondary.pages = {};
      }
      if (!state.secondary.pages[key]) {
        state.secondary.pages[key] = { eyebrow: state.secondary.eyebrow, title: state.secondary.title, desc: state.secondary.desc };
      }
      const pageBox = item(head, "二级页 " + key);
      textField(pageBox, "小标题", "secondary.pages." + key + ".eyebrow");
      textField(pageBox, "标题", "secondary.pages." + key + ".title");
      textField(pageBox, "描述", "secondary.pages." + key + ".desc", true);
    });

    const products = group(parent, "商品列表", true);
    listHeader(products, "商品卡片数量", "secondary.products", function () {
      return { tag: "新品上市", title: "New Product", desc: "请填写商品描述。", image: normalizeImageValue("lv_assets/prod1.jpg", "lv_assets/prod1.jpg") };
    });

    state.secondary.products.forEach((entry, index) => {
      const box = item(products, "商品 " + (index + 1));
      listControls(box, "secondary.products", index);
      textField(box, "标签", "secondary.products." + index + ".tag");
      textField(box, "名称", "secondary.products." + index + ".title");
      textField(box, "描述", "secondary.products." + index + ".desc", true);
      imageField(box, "图片", "secondary.products." + index + ".image");
    });
  }

  function buildTertiary(parent) {
    const head = group(parent, "详情页页头", true);
    const headBox = item(head, "页头文字");
    textField(headBox, "小标题", "tertiary.eyebrow");
    textField(headBox, "标题", "tertiary.title");
    textField(headBox, "描述", "tertiary.desc", true);
    const activeProduct = state.tertiary.productCatalog[getActiveProductId()];
    if (activeProduct) {
      const copyBox = item(head, "商品故事 / 产品介绍");
      textField(copyBox, "商品故事", "tertiary.productCatalog." + getActiveProductId() + ".story", true);
      textField(copyBox, "产品介绍", "tertiary.productCatalog." + getActiveProductId() + ".intro", true);
    }

    const gallery = group(parent, "产品图库 / 左侧缩略图", true);
    listHeader(gallery, "产品图数量", "tertiary.gallery", function () {
      return {
        image: normalizeImageValue("lv_assets/prod1.jpg", "lv_assets/prod1.jpg"),
        thumb: normalizeImageValue("lv_assets/prod1.jpg", "lv_assets/prod1.jpg"),
      };
    });
    state.tertiary.gallery.forEach((entry, index) => {
      const box = item(gallery, "产品图 " + (index + 1));
      listControls(box, "tertiary.gallery", index);
      imageField(box, "大图", "tertiary.gallery." + index + ".image");
      imageField(box, "缩略图", "tertiary.gallery." + index + ".thumb");
    });

    const models = group(parent, "模特 / 场景图", false);
    listHeader(models, "模特图数量", "tertiary.modelCards", function () {
      return { title: "Model", image: normalizeImageValue("lv_assets/model5.jpg", "lv_assets/model5.jpg") };
    });
    state.tertiary.modelCards.forEach((entry, index) => {
      const box = item(models, "卡片 " + (index + 1));
      listControls(box, "tertiary.modelCards", index);
      textField(box, "标题", "tertiary.modelCards." + index + ".title");
      imageField(box, "图片", "tertiary.modelCards." + index + ".image");
    });

    const details = group(parent, "详情长图", false);
    listHeader(details, "详情长图数量", "tertiary.detailImages", function () {
      const fallback = firstAvailableDetailImage(getActiveProductId()) || "lv_assets/photo/1003/1003-pdd/20260611025631-1003-pdd-1 (1).jpg";
      return normalizeImageValue(fallback, imageValueSrc(fallback));
    });
    state.tertiary.detailImages.forEach((entry, index) => {
      const box = item(details, "长图 " + (index + 1));
      listControls(box, "tertiary.detailImages", index);
      imageField(box, "图片", "tertiary.detailImages." + index);
    });

    const slices = group(parent, "模特展示图", false);
    state.tertiary.slices.forEach((entry, index) => {
      const box = item(slices, index === 3 ? "底部长图" : "模特展示 " + (index + 1));
      if (index < 3) {
        textField(box, "标题", "tertiary.slices." + index + ".title");
        textField(box, "描述", "tertiary.slices." + index + ".desc", true);
      }
      imageField(box, "图片", "tertiary.slices." + index + ".image");
    });
  }

  async function openExport() {
    const result = await runAssetPreflight("export");
    if (!result) {
      return;
    }
    const box = document.querySelector(".huan-export-box");
    const area = box.querySelector("textarea");
    area.value = result.repairedContent || configText();
    box.classList.add("active");
    area.focus();
    area.select();
  }

  async function copyConfig() {
    const result = await runAssetPreflight("export-copy");
    if (!result) {
      return;
    }
    const textValue = result.repairedContent || configText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textValue).catch(function () {});
    }
    const box = document.querySelector(".huan-export-box");
    box.querySelector("textarea").value = textValue;
  }

  async function saveConfig() {
    const preflight = await runAssetPreflight("save");
    if (!preflight) {
      return;
    }
    try {
      const response = await fetch(SAVE_HELPER_URL + "/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: preflight.repairedContent || configText() }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        const message = formatAssetIssues(result) || result.error || "保存失败";
        console.error("[ASSET CHECK FAILED]", result.assetReport || result);
        alert(message);
        setHelperStatus("发现图片问题，请查看详情", false);
        return;
      }
      if (!isExpectedSaveTarget(result.projectFile)) {
        setHelperStatus("保存助手路径不匹配，未确认保存到当前项目: " + result.projectFile, false);
        return;
      }
      console.log("[ASSET CHECK PASSED] 所有图片资源检查通过", result.assetReport || {});
      if (preflight.repairedContent) {
        applyRepairedConfig(preflight.repairedContent);
      }
      setHelperStatus("图片资源安全，可以保存/导出。已保存: " + result.projectFile + " + Downloads 备份", true);
    } catch (error) {
      setHelperStatus(error && error.message ? error.message : "保存失败，请检查保存助手窗口", false);
    }
  }

  window.changeProductImage = function (productIdOrIndex, maybeIndex) {
    let productId = getActiveProductId();
    let index = productIdOrIndex;
    if (typeof productIdOrIndex === "string") {
      productId = productIdOrIndex;
      index = maybeIndex;
      setActiveProductDetail(productId);
    }
    if (!state.tertiary.gallery.length) {
      return;
    }
    if (typeof index !== "number") {
      index = 0;
    }
    currentProductIndex = (index + state.tertiary.gallery.length) % state.tertiary.gallery.length;
    state.tertiary.mainImage = state.tertiary.gallery[currentProductIndex].image.src;
    renderProductGallery();
  };

  window.showProductDetail = function (productId) {
    const nextProductId = setActiveProductDetail(productId) ? productId : "1003";
    if (nextProductId !== productId) {
      setActiveProductDetail(nextProductId);
    }
    renderStaticContent();
    renderProductGallery();
    renderModelCards();
    renderDetailImages();
    if (isEditorOpen) {
      buildEditor();
    }
    showPage("tertiary-" + (state.tertiary.activeProductId || nextProductId));
  };

  window.prevProductImage = function (productId) {
    if (productId) {
      setActiveProductDetail(productId);
    }
    window.changeProductImage(productId || getActiveProductId(), currentProductIndex - 1);
  };

  window.nextProductImage = function (productId) {
    if (productId) {
      setActiveProductDetail(productId);
    }
    window.changeProductImage(productId || getActiveProductId(), currentProductIndex + 1);
  };

  window.HUAN_APPLY_MANAGED_FIT = fitManagedImage;
  window.addEventListener("load", function () {
    fitAllManagedImages();
  });
  window.addEventListener("resize", function () {
    fitAllManagedImages();
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeImageLightbox();
    }
    if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "e") {
      event.preventDefault();
      toggleEditor();
    }
    if (isEditorOpen && event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undoChange();
    }
    if (isEditorOpen && ((event.ctrlKey && event.key.toLowerCase() === "y") || (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z"))) {
      event.preventDefault();
      redoChange();
    }
  }, true);

  createEditor();
  bindImageLightbox();
  const initialProductMatch = (location.hash || "").match(/^#tertiary-(.+)$/);
  const initialProductId = window.__HUAN_PENDING_PRODUCT_ID || (initialProductMatch && initialProductMatch[1]);
  if (initialProductId) {
    window.showProductDetail(initialProductId);
    window.__HUAN_PENDING_PRODUCT_ID = "";
  } else if (location.hash === "#tertiary") {
    window.showProductDetail("1003");
  } else {
    renderSite();
  }
  window.HUAN_EDITOR = {
    config: state,
    defaults: defaultConfig,
    render: renderSite,
    open: toggleEditor,
    undo: undoChange,
    redo: redoChange,
    save: saveConfig,
    prev: window.prevProductImage,
    next: window.nextProductImage,
    showProductDetail: window.showProductDetail,
  };
})();

