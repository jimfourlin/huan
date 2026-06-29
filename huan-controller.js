(function () {
  const API = "http://127.0.0.1:43210";
  const MOVE_STEP = 2;
  const PROJECT_NAME = decodeURIComponent(location.pathname)
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .slice(-2, -1)[0] || "HUAN_site_package_20260610";

  const text = {
    parseError: "\u65e0\u6cd5\u89e3\u6790 huan-config.js",
    loading: "\u6b63\u5728\u8bfb\u53d6\u914d\u7f6e...",
    connected: "\u5df2\u8fde\u63a5\uff1a",
    wrongHelper: "\u4fdd\u5b58\u52a9\u624b\u672a\u6307\u5411\u5f53\u524d\u9879\u76ee\uff1a",
    unknownPath: "\u672a\u77e5\u8def\u5f84",
    upload: "\u6b63\u5728\u4e0a\u4f20\u56fe\u7247...",
    uploadDone: "\u4e0a\u4f20\u5b8c\u6210\uff0c\u8bf7\u70b9\u51fb\u4fdd\u5b58\u914d\u7f6e\u3002",
    checkingAssets: "\u6b63\u5728\u68c0\u67e5\u56fe\u7247\u8d44\u6e90...",
    assetSafe: "\u56fe\u7247\u8d44\u6e90\u5b89\u5168\uff0c\u53ef\u4ee5\u4fdd\u5b58/\u5bfc\u51fa\u3002",
    assetFailed: "\u53d1\u73b0\u56fe\u7247\u95ee\u9898\uff0c\u8bf7\u67e5\u770b\u8be6\u60c5\u3002",
    save: "\u6b63\u5728\u4fdd\u5b58\u914d\u7f6e...",
    saved: "\u5df2\u4fdd\u5b58\uff0c\u5df2\u91cd\u65b0\u8bfb\u53d6\u63a7\u5236\u5668\u3002",
    failed: "\u64cd\u4f5c\u5931\u8d25",
    empty: "\u6ca1\u6709\u5339\u914d\u7684\u5185\u5bb9\u3002",
    itemCount: " \u9879",
  };

  const homeGroups = [
    { key: "home.hero", label: "\u9876\u90e8\u8f6e\u64ad", arrays: ["heroSlides"] },
    { key: "home.categories", label: "\u4ea7\u54c1\u6444\u5f71", arrays: ["categories"] },
    { key: "home.stories", label: "\u6545\u4e8b\u5361\u7247", arrays: ["stories"] },
    { key: "home.scene", label: "\u573a\u666f\u8f6e\u64ad", arrays: ["sceneSlides"] },
    { key: "home.visual", label: "\u89c6\u89c9\u5c55\u793a", arrays: ["visualProducts"] },
    { key: "home.journal", label: "\u4e09\u8054\u56fe", arrays: ["journalPanels"] },
    { key: "home.static", label: "\u9759\u6001\u56fe\u7247", arrays: [] },
  ];

  const secondaryGroups = [
    { key: "women", label: "\u5973\u978b" },
    { key: "men", label: "\u7537\u978b" },
    { key: "kids", label: "\u7ae5\u978b" },
  ];

  const state = {
    config: null,
    configVersion: "",
    activeView: "home.categories",
    search: "",
    dirty: false,
    pendingAdd: null,
    openSecondaryGroups: { women: true, men: false, kids: false },
    openTertiaryGroups: { women: true, men: false, kids: false },
    openTertiaryProducts: {},
  };

  const statusNode = document.querySelector("[data-status]");
  const tabsNode = document.querySelector("[data-tabs]");
  const listNode = document.querySelector("[data-list]");
  const countNode = document.querySelector("[data-count]");
  const searchNode = document.querySelector("[data-search]");
  const titleNode = document.querySelector("[data-section-title]");
  const subtitleNode = document.querySelector("[data-section-subtitle]");
  const actionsNode = document.querySelector("[data-section-actions]");
  const addFileInput = document.querySelector("[data-add-file]");
  const imageTemplate = document.querySelector("#image-card-template");
  const textTemplate = document.querySelector("#text-card-template");
  const summaryTemplate = document.querySelector("#summary-card-template");

  function setStatus(message, mode) {
    statusNode.textContent = message;
    statusNode.classList.toggle("ok", mode === "ok");
    statusNode.classList.toggle("bad", mode === "bad");
  }

  function parseConfig(content) {
    const match = content.match(/window\.HUAN_SITE_CONFIG\s*=\s*([\s\S]*?);\s*$/);
    if (!match) throw new Error(text.parseError);
    return JSON.parse(match[1]);
  }

  function configText() {
    return "window.HUAN_SITE_CONFIG = " + JSON.stringify(state.config, null, 2) + ";\n";
  }

  function clamp(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, number));
  }

  function ensureImage(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        src: value.src || "",
        scale: clamp(value.scale, 1, 0.5, 3),
        offsetX: clamp(value.offsetX, 50, 0, 100),
        offsetY: clamp(value.offsetY, 50, 0, 100),
        isUploaded: !!value.isUploaded,
      };
    }
    return {
      src: typeof value === "string" ? value : "",
      scale: 1,
      offsetX: 50,
      offsetY: 50,
      isUploaded: false,
    };
  }

  function getPath(path) {
    return path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), state.config);
  }

  function setPath(path, value) {
    const parts = path.split(".");
    const last = parts.pop();
    const target = parts.reduce((obj, key) => obj[key], state.config);
    target[last] = value;
    state.dirty = true;
  }

  function productIds() {
    return Object.keys((state.config && state.config.tertiary && state.config.tertiary.productCatalog) || {});
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function ensureControllerConfig() {
    if (!state.config.controllerTitles || typeof state.config.controllerTitles !== "object") {
      state.config.controllerTitles = {};
    }
    const ids = productIds();
    const listedSecondaryIds = Array.from(new Set(((state.config.secondary && state.config.secondary.products) || []).map((item) => item && item.productId).filter(Boolean)));
    state.config.controllerGroups = state.config.controllerGroups || {};
    const secondary = state.config.controllerGroups.secondary || {};
    state.config.controllerGroups.secondary = {
      women: Array.isArray(secondary.women) && secondary.women.length ? secondary.women : listedSecondaryIds,
      men: Array.isArray(secondary.men) && secondary.men.length ? secondary.men : ids.slice(1, 2),
      kids: Array.isArray(secondary.kids) && secondary.kids.length ? secondary.kids : ids.slice(2, 3),
    };
    const fallbackSlices = Array.isArray(state.config.tertiary && state.config.tertiary.slices) ? state.config.tertiary.slices : [];
    ids.forEach((productId) => {
      const product = state.config.tertiary.productCatalog[productId];
      if (product && (!Array.isArray(product.slices) || !product.slices.length)) {
        product.slices = clone(fallbackSlices);
      }
      if (product && Array.isArray(product.slices) && product.slices.length === 3) {
        product.slices.splice(2, 0, clone(product.slices[1] || product.slices[0] || {}));
      }
    });
  }

  function groupLabel(groupKey) {
    const group = secondaryGroups.find((entry) => entry.key === groupKey);
    return group ? group.label : groupKey;
  }

  function controllerProductKey(productId) {
    return "product." + productId;
  }

  function productGroupTitle(productId) {
    const titles = state.config.controllerTitles || {};
    if (titles[controllerProductKey(productId)]) return titles[controllerProductKey(productId)];
    const match = ((state.config.secondary && state.config.secondary.products) || [])
      .map((entry, index) => ({ entry, index }))
      .find(({ entry, index }) => entry && entry.productId === productId && titles["secondary.products." + index + ".image"]);
    return match ? titles["secondary.products." + match.index + ".image"] : productId + " \u4ea7\u54c1";
  }

  function tertiaryProductIdsForGroup(groupKey) {
    const ids = (state.config.controllerGroups && state.config.controllerGroups.secondary && state.config.controllerGroups.secondary[groupKey]) || [];
    const seen = new Set();
    return ids.filter((productId) => {
      if (seen.has(productId) || !state.config.tertiary.productCatalog[productId]) return false;
      seen.add(productId);
      return true;
    });
  }

  function tertiaryGroupForProduct(productId) {
    const groups = state.config.controllerGroups && state.config.controllerGroups.secondary;
    const found = secondaryGroups.find((group) => ((groups && groups[group.key]) || []).includes(productId));
    return found ? found.key : "women";
  }

  function productImage(productId) {
    const product = state.config.tertiary.productCatalog[productId];
    return product && product.gallery && product.gallery[0] ? ensureImage(product.gallery[0].image).src : "";
  }

  const PRODUCT_ID_PATTERN = /(1003|1008|3009|3605|3623|6316|9956|9957|9963)/;

  function productIdFromFileName(name) {
    const fileName = String(name || "").replace(/\\/g, "/").split("/").pop() || "";
    const match = fileName.match(PRODUCT_ID_PATTERN);
    return match ? match[1] : "";
  }

  function ratioFor(kind) {
    return {
      logo: "3 / 1",
      homeHero: "16 / 9",
      homeHeroImage: "16 / 9",
      homeCategory: "1.08 / 1",
      homeStory: "2.15 / 1",
      homeScene: "16 / 9",
      homeVisual: "1.32 / 1",
      homeJournal: "8 / 9",
      secondary: "16 / 9",
      bai: "16 / 9",
      mode: "1 / 1.22",
      pdd: "3 / 5",
      slice: "1.55 / 1",
      long: "2.1 / 1",
    }[kind] || "1 / 1";
  }

  function renderNav() {
    tabsNode.innerHTML = "";
    addNavTitle("\u9996\u9875");
    homeGroups.forEach((group) => addNavButton(group.label, group.key, 2, countForView(group.key)));
    addNavTitle("\u4e8c\u7ea7\u9875");
    secondaryGroups.forEach((group) => {
      const view = "secondary." + group.key;
      const isOpen = !!state.openSecondaryGroups[group.key];
      addNavGroupButton(group.label, view, 2, secondaryEntries(group.key).length, isOpen, () => {
        state.openSecondaryGroups[group.key] = !isOpen;
        if (!isOpen) state.activeView = view;
        renderAll();
      });
      if (isOpen) addNavButton("\u5546\u54c1\u5217\u8868", view, 3, secondaryEntries(group.key).length);
    });
    addNavTitle("\u4e09\u7ea7\u9875");
    secondaryGroups.forEach((group) => {
      const isGroupOpen = !!state.openTertiaryGroups[group.key];
      const groupProducts = tertiaryProductIdsForGroup(group.key);
      addNavGroupButton(group.label, "tertiaryGroup." + group.key, 2, groupProducts.length, isGroupOpen, () => {
        state.openTertiaryGroups[group.key] = !isGroupOpen;
        renderAll();
      });
      if (!isGroupOpen) return;
      groupProducts.forEach((productId) => {
        const product = state.config.tertiary.productCatalog[productId];
        const isOpen = !!state.openTertiaryProducts[productId];
        addNavGroupButton(productGroupTitle(productId), "tertiary." + productId + ".overview", 3, null, isOpen, () => {
          state.openTertiaryProducts[productId] = !isOpen;
          if (!isOpen) state.activeView = "tertiary." + productId + ".overview";
          renderAll();
        });
        if (isOpen) {
          addNavButton("\u7f29\u7565\u56fe / \u767d\u5e95\u56fe", "tertiary." + productId + ".gallery", 4, product.gallery.length);
          addNavButton("\u6a21\u7279\u56fe", "tertiary." + productId + ".modelCards", 4, product.modelCards.length);
          addNavButton("\u8be6\u60c5\u9875", "tertiary." + productId + ".detailImages", 4, product.detailImages.length);
          addNavButton("\u5356\u70b9\u56fe\u6587", "tertiary." + productId + ".slices", 4, (product.slices || []).length);
        }
      });
    });
    productIds().forEach((productId) => {
      if (secondaryGroups.some((group) => tertiaryProductIdsForGroup(group.key).includes(productId))) return;
      const product = state.config.tertiary.productCatalog[productId];
      const isOpen = !!state.openTertiaryProducts[productId];
      addNavGroupButton(productGroupTitle(productId), "tertiary." + productId + ".overview", 2, null, isOpen, () => {
        state.openTertiaryProducts[productId] = !isOpen;
        if (!isOpen) state.activeView = "tertiary." + productId + ".overview";
        renderAll();
      });
      if (isOpen) {
        addNavButton("\u7f29\u7565\u56fe / \u767d\u5e95\u56fe", "tertiary." + productId + ".gallery", 3, product.gallery.length);
        addNavButton("\u6a21\u7279\u56fe", "tertiary." + productId + ".modelCards", 3, product.modelCards.length);
        addNavButton("\u8be6\u60c5\u9875", "tertiary." + productId + ".detailImages", 3, product.detailImages.length);
        addNavButton("\u5356\u70b9\u56fe\u6587", "tertiary." + productId + ".slices", 3, (product.slices || []).length);
      }
    });
  }

  function addNavTitle(label) {
    const node = document.createElement("div");
    node.className = "nav-title";
    node.textContent = label;
    tabsNode.appendChild(node);
  }

  function addNavButton(label, key, depth, count) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "depth-" + depth + (state.activeView === key ? " active" : "");
    button.innerHTML = "<span>" + label + "</span>" + (count === null ? "" : "<strong>" + count + "</strong>");
    button.addEventListener("click", () => {
      state.activeView = key;
      openTertiaryNavForView(key);
      renderAll();
    });
    tabsNode.appendChild(button);
  }

  function addNavGroupButton(label, key, depth, count, isOpen, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "depth-" + depth + " nav-group" + (state.activeView === key ? " active" : "") + (isOpen ? " open" : "");
    button.innerHTML = "<span><i>" + (isOpen ? "\u25be" : "\u25b8") + "</i>" + label + "</span>" + (count === null ? "" : "<strong>" + count + "</strong>");
    button.addEventListener("click", onClick);
    tabsNode.appendChild(button);
  }

  function countForView(key) {
    if (key === "home.static") return Object.keys(state.config.staticImages || {}).length;
    const group = homeGroups.find((entry) => entry.key === key);
    return group ? group.arrays.reduce((total, name) => total + (state.config.home[name] || []).length, 0) : 0;
  }

  function secondaryEntries(groupKey) {
    const ids = (state.config.controllerGroups && state.config.controllerGroups.secondary && state.config.controllerGroups.secondary[groupKey]) || [];
    const idSet = new Set(ids);
    return (state.config.secondary.products || [])
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => !idSet.size || idSet.has(entry.productId));
  }

  function secondaryGroupFromView() {
    const parts = state.activeView.split(".");
    return parts[0] === "secondary" && parts[1] ? parts[1] : "women";
  }

  function currentTitle() {
    if (state.activeView.startsWith("home.")) {
      const group = homeGroups.find((entry) => entry.key === state.activeView);
      return { title: "\u9996\u9875 / " + (group ? group.label : ""), subtitle: "\u7ba1\u7406\u9996\u9875\u5bf9\u5e94\u529f\u80fd\u533a\u7684\u56fe\u7247\u548c\u6587\u5b57\u3002" };
    }
    if (state.activeView.startsWith("secondary.")) return { title: "\u4e8c\u7ea7\u9875 / " + groupLabel(secondaryGroupFromView()), subtitle: "\u4ec5\u5728\u56fe\u7247\u63a7\u5236\u5668\u4e2d\u6309\u5973\u978b\u3001\u7537\u978b\u3001\u7ae5\u978b\u6298\u53e0\u6574\u7406\uff0c\u4e0d\u6539\u524d\u53f0\u5206\u7c7b\u903b\u8f91\u3002" };
    const info = parseTertiaryView();
    if (info.list === "overview") return { title: "\u4e09\u7ea7\u9875 / " + productGroupTitle(info.productId) + " \u603b\u89c8", subtitle: "\u5148\u67e5\u770b\u8fd9\u4e2a\u4ea7\u54c1\u7684\u4e09\u7c7b\u56fe\u7247\u6570\u91cf\uff0c\u518d\u8fdb\u5165\u5bf9\u5e94\u677f\u5757\u7f16\u8f91\u3002" };
    const labels = { gallery: "\u7f29\u7565\u56fe / \u767d\u5e95\u56fe", modelCards: "\u6a21\u7279\u56fe", detailImages: "\u8be6\u60c5\u9875", slices: "\u5356\u70b9\u56fe\u6587" };
    return { title: "\u4e09\u7ea7\u9875 / " + productGroupTitle(info.productId) + " / " + labels[info.list], subtitle: "\u8fd9\u91cc\u7684\u589e\u51cf\u53ea\u5f71\u54cd\u5f53\u524d\u4ea7\u54c1\u7684\u5bf9\u5e94\u56fe\u7247\u6570\u91cf\u3002" };
  }

  function parseTertiaryView() {
    const parts = state.activeView.split(".");
    return { productId: parts[1], list: parts[2] };
  }

  function openTertiaryNavForView(view) {
    if (!view.startsWith("tertiary.")) return;
    const productId = view.split(".")[1];
    state.openTertiaryGroups[tertiaryGroupForProduct(productId)] = true;
    state.openTertiaryProducts[productId] = true;
  }

  function renderAll() {
    renderNav();
    const heading = currentTitle();
    titleNode.textContent = heading.title;
    subtitleNode.textContent = heading.subtitle;
    renderActions();
    renderList();
  }

  function renderActions() {
    actionsNode.innerHTML = "";
    if (state.activeView.startsWith("secondary.")) {
      const select = document.createElement("select");
      productIds().forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = id;
        select.appendChild(option);
      });
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "\u65b0\u589e\u5546\u54c1";
      button.addEventListener("click", () => addSecondaryProduct(select.value, secondaryGroupFromView()));
      actionsNode.append(select, button);
      return;
    }
    const info = state.activeView.startsWith("tertiary.") ? parseTertiaryView() : null;
    if (info && ["gallery", "modelCards", "detailImages"].includes(info.list)) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "\u4e0a\u4f20\u65b0\u589e";
      button.addEventListener("click", () => {
        state.pendingAdd = info;
        addFileInput.value = "";
        addFileInput.click();
      });
      actionsNode.appendChild(button);
    }
  }

  function itemsForCurrentView() {
    if (state.activeView.startsWith("home.")) return homeItems();
    if (state.activeView.startsWith("secondary.")) return secondaryItems(secondaryGroupFromView());
    const info = parseTertiaryView();
    if (info.list === "overview") return tertiaryOverviewItems(info.productId);
    if (info.list === "slices") return sliceItems(info.productId);
    return tertiaryItems(info.productId, info.list);
  }

  function homeItems() {
    const items = [];
    const home = state.config.home;
    if (state.activeView === "home.hero") {
      (home.heroSlides || []).forEach((entry, index) => {
        if (entry.type === "video") {
          items.push(videoItem("\u9876\u90e8\u8f6e\u64ad\u89c6\u9891 " + (index + 1), index));
        } else {
          items.push(imageItem("\u9876\u90e8\u8f6e\u64ad\u56fe\u7247 " + (index + 1), "home.heroSlides." + index + ".src", "homeHeroImage", {
            fields: [{ label: "\u8f6e\u64ad\u6587\u6848", path: "home.heroSlides." + index + ".caption", multiline: true }],
          }));
        }
      });
    }
    if (state.activeView === "home.categories") {
      home.categories.forEach((entry, index) => items.push(imageItem("\u4ea7\u54c1\u6444\u5f71 " + (index + 1), "home.categories." + index + ".image", "homeCategory", {
        fields: [
          { label: "\u6807\u9898", path: "home.categories." + index + ".title" },
          { label: "Shop Now \u6587\u6848", path: "home.categories." + index + ".cta" },
        ],
      })));
    }
    if (state.activeView === "home.stories") {
      home.stories.forEach((entry, index) => items.push(imageItem("\u6545\u4e8b\u5361\u7247 " + (index + 1), "home.stories." + index + ".image", "homeStory", {
        fields: [
          { label: "\u6807\u9898", path: "home.stories." + index + ".title" },
          { label: "\u63cf\u8ff0", path: "home.stories." + index + ".desc", multiline: true },
        ],
      })));
    }
    if (state.activeView === "home.scene") {
      items.push(textItem("\u573a\u666f\u8f6e\u64ad\u6587\u6848", [{ label: "\u6587\u6848", path: "home.sceneCaption", multiline: true }]));
      home.sceneSlides.forEach((entry, index) => items.push(imageItem("\u573a\u666f\u8f6e\u64ad " + (index + 1), "home.sceneSlides." + index + ".image", "homeScene")));
    }
    if (state.activeView === "home.visual") {
      home.visualProducts.forEach((entry, index) => items.push(imageItem("\u89c6\u89c9\u5c55\u793a " + (index + 1), "home.visualProducts." + index + ".image", "homeVisual", {
        fields: [
          { label: "\u6807\u9898", path: "home.visualProducts." + index + ".title" },
          { label: "\u63cf\u8ff0", path: "home.visualProducts." + index + ".desc" },
        ],
      })));
    }
    if (state.activeView === "home.journal") {
      home.journalPanels.forEach((entry, index) => items.push(imageItem("\u4e09\u8054\u56fe " + (index + 1), "home.journalPanels." + index + ".image", "homeJournal", {
        fields: [{ label: "\u6807\u9898", path: "home.journalPanels." + index + ".title" }],
      })));
    }
    if (state.activeView === "home.static") {
      Object.keys(state.config.staticImages || {}).forEach((key) => items.push(imageItem(key === "logo" ? "Logo" : "\u9875\u811a\u56fe\u7247", "staticImages." + key, key === "logo" ? "logo" : "homeHero")));
    }
    return items;
  }

  function secondaryItems(groupKey) {
    if (!state.config.secondary.pages) state.config.secondary.pages = {};
    if (!state.config.secondary.pages[groupKey]) {
      state.config.secondary.pages[groupKey] = {
        eyebrow: state.config.secondary.eyebrow || "",
        title: state.config.secondary.title || "",
        desc: state.config.secondary.desc || "",
      };
    }
    const items = [
      textItem("\u4e8c\u7ea7\u9875\u9875\u5934 / " + groupLabel(groupKey), [
        { label: "\u5c0f\u6807", path: "secondary.pages." + groupKey + ".eyebrow" },
        { label: "\u6807\u9898", path: "secondary.pages." + groupKey + ".title" },
        { label: "\u63cf\u8ff0", path: "secondary.pages." + groupKey + ".desc", multiline: true },
      ]),
    ];
    secondaryEntries(groupKey).forEach(({ entry, index }) => {
      items.push(imageItem((entry.productId || "\u5546\u54c1") + " \u5546\u54c1 " + (index + 1), "secondary.products." + index + ".image", "secondary", {
        productId: entry.productId || "",
        syncProductTitle: true,
        fields: [
          { label: "\u6807\u7b7e", path: "secondary.products." + index + ".tag" },
          { label: "\u6807\u9898", path: "secondary.products." + index + ".title" },
          { label: "\u63cf\u8ff0", path: "secondary.products." + index + ".desc", multiline: true },
        ],
        remove: { arrayPath: "secondary.products", index },
      }));
    });
    return items;
  }

  function tertiaryItems(productId, listName) {
    const product = state.config.tertiary.productCatalog[productId];
    const items = [];
    if (!product) return items;
    if (listName === "gallery") {
      product.gallery.forEach((entry, index) => items.push(imageItem(productId + " \u767d\u5e95\u56fe " + (index + 1), "tertiary.productCatalog." + productId + ".gallery." + index + ".image", "bai", {
        thumbPath: "tertiary.productCatalog." + productId + ".gallery." + index + ".thumb",
        remove: { arrayPath: "tertiary.productCatalog." + productId + ".gallery", index },
        uploadTargetDir: productDir(productId, "bai"),
      })));
    }
    if (listName === "modelCards") {
      product.modelCards.forEach((entry, index) => items.push(imageItem(productId + " \u6a21\u7279\u56fe " + (index + 1), "tertiary.productCatalog." + productId + ".modelCards." + index + ".image", "mode", {
        fields: [{ label: "\u6807\u9898", path: "tertiary.productCatalog." + productId + ".modelCards." + index + ".title" }],
        remove: { arrayPath: "tertiary.productCatalog." + productId + ".modelCards", index },
        uploadTargetDir: productDir(productId, "mode"),
      })));
    }
    if (listName === "detailImages") {
      product.detailImages.forEach((entry, index) => items.push(imageItem(productId + " \u8be6\u60c5\u9875 " + (index + 1), "tertiary.productCatalog." + productId + ".detailImages." + index, "pdd", {
        remove: { arrayPath: "tertiary.productCatalog." + productId + ".detailImages", index },
        uploadTargetDir: productDir(productId, "pdd"),
      })));
    }
    return items;
  }

  function tertiaryOverviewItems(productId) {
    const product = state.config.tertiary.productCatalog[productId];
    if (!product) return [];
    return [
      textItem("\u5546\u54c1\u6545\u4e8b / \u4ea7\u54c1\u4ecb\u7ecd", [
        { label: "\u5546\u54c1\u6545\u4e8b", path: "tertiary.productCatalog." + productId + ".story", multiline: true },
        { label: "\u4ea7\u54c1\u4ecb\u7ecd", path: "tertiary.productCatalog." + productId + ".intro", multiline: true },
      ]),
      summaryItem("\u7f29\u7565\u56fe / \u767d\u5e95\u56fe", product.gallery.length + " \u5f20", productId, "gallery"),
      summaryItem("\u6a21\u7279\u56fe", product.modelCards.length + " \u5f20", productId, "modelCards"),
      summaryItem("\u8be6\u60c5\u9875", product.detailImages.length + " \u5f20", productId, "detailImages"),
      summaryItem("\u6a21\u7279\u5c55\u793a\u56fe", (product.slices || []).length + " \u5f20", productId, "slices"),
    ];
  }

  function sliceItems(productId) {
    const product = state.config.tertiary.productCatalog[productId];
    const slices = product && Array.isArray(product.slices) ? product.slices : [];
    return slices.map((entry, index) => imageItem(index === 3 ? "\u5e95\u90e8\u957f\u56fe" : "\u6a21\u7279\u5c55\u793a " + (index + 1), "tertiary.productCatalog." + productId + ".slices." + index + ".image", index === 3 ? "long" : "slice", {
      fields: index < 3 ? [
        { label: "\u56fe\u7247\u6807\u9898", path: "tertiary.productCatalog." + productId + ".slices." + index + ".title" },
        { label: "\u753b\u9762\u8bf4\u660e", path: "tertiary.productCatalog." + productId + ".slices." + index + ".desc", multiline: true },
      ] : [],
    }));
  }

  function imageItem(title, path, kind, options) {
    const image = ensureImage(getPath(path));
    setPathSilently(path, image);
    return Object.assign({ type: "image", title, path, kind, image, ratio: ratioFor(kind), fields: [] }, options || {});
  }

  function controllerTitle(item) {
    const titles = state.config.controllerTitles || {};
    return titles[item.path] || item.title;
  }

  function setControllerTitle(item, value) {
    ensureControllerConfig();
    const next = value.trim();
    if (next && next !== item.title) {
      state.config.controllerTitles[item.path] = next;
      if (item.syncProductTitle && item.productId) state.config.controllerTitles[controllerProductKey(item.productId)] = next;
    } else {
      delete state.config.controllerTitles[item.path];
      if (item.syncProductTitle && item.productId) delete state.config.controllerTitles[controllerProductKey(item.productId)];
    }
    state.dirty = true;
  }

  function textItem(title, fields) {
    return { type: "text", title, fields };
  }

  function videoItem(title, index) {
    return {
      type: "text",
      title,
      fields: [
        { label: "\u8f6e\u64ad\u6587\u6848", path: "home.heroSlides." + index + ".caption", multiline: true },
        { label: "\u89c6\u9891\u8def\u5f84", path: "home.heroSlides." + index + ".src" },
        { label: "\u5c01\u9762 poster", path: "home.heroSlides." + index + ".poster" },
      ],
    };
  }

  function summaryItem(title, desc, productId, list) {
    return { type: "summary", title, desc, productId, list };
  }

  function setPathSilently(path, value) {
    const wasDirty = state.dirty;
    setPath(path, value);
    state.dirty = wasDirty;
  }

  function renderList() {
    const q = state.search.trim().toLowerCase();
    const items = itemsForCurrentView().filter((item) => {
      if (!q) return true;
      const haystack = item.type === "image"
        ? controllerTitle(item) + " " + item.title + " " + item.path + " " + item.image.src + " " + textFieldsValue(item.fields)
        : item.title + " " + textFieldsValue(item.fields);
      return haystack.toLowerCase().includes(q);
    });
    listNode.innerHTML = "";
    countNode.textContent = items.length + text.itemCount;
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = text.empty;
      listNode.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      if (item.type === "summary") listNode.appendChild(renderSummaryCard(item));
      else listNode.appendChild(item.type === "text" ? renderTextCard(item) : renderImageCard(item));
    });
  }

  function textFieldsValue(fields) {
    return (fields || []).map((field) => String(getPath(field.path) || "")).join(" ");
  }

  function renderImageCard(item) {
    const node = imageTemplate.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    const preview = node.querySelector(".preview-wrap");
    const ratio = node.querySelector("[data-ratio]");
    const title = node.querySelector(".card-title");
    const srcInput = node.querySelector("[data-field='src']");
    const remove = node.querySelector("[data-action='remove']");
    preview.style.setProperty("--preview-aspect-ratio", item.ratio);
    if (ratio) {
      ratio.textContent = "\u6bd4\u4f8b\uff1a" + item.ratio;
    }
    title.innerHTML = "";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "card-title-input";
    titleInput.value = controllerTitle(item);
    titleInput.setAttribute("aria-label", "\u63a7\u5236\u5668\u9884\u89c8\u6807\u9898");
    const titleMarker = document.createElement("div");
    titleMarker.className = "controller-title-marker";
    title.append(titleInput, titleMarker);
    titleInput.addEventListener("input", () => setControllerTitle(item, titleInput.value));
    renderTextFields(node.querySelector("[data-text-fields]"), item.fields || []);
    srcInput.value = item.image.src;
    applyPreview(img, item.image);
    syncOutputs(node, item.image);
    remove.hidden = !item.remove;
    remove.addEventListener("click", () => removeItem(item.remove));
    srcInput.addEventListener("input", () => updateImage(item, img, node, { src: srcInput.value, isUploaded: false }));
    node.querySelector("[data-field='scale']").addEventListener("input", (event) => updateImage(item, img, node, { scale: clamp(event.target.value, 1, 0.5, 3) }));
    node.querySelector("[data-field='offsetX']").addEventListener("input", (event) => updateImage(item, img, node, { offsetX: clamp(event.target.value, 50, 0, 100) }));
    node.querySelector("[data-field='offsetY']").addEventListener("input", (event) => updateImage(item, img, node, { offsetY: clamp(event.target.value, 50, 0, 100) }));
    node.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => moveImage(button.dataset.move, item, img, node)));
    node.querySelector("[data-action='reset']").addEventListener("click", () => updateImage(item, img, node, { scale: 1, offsetX: 50, offsetY: 50 }));
    node.querySelector("[data-field='upload']").addEventListener("change", (event) => uploadReplacement(event.target.files && event.target.files[0], item, img, node, srcInput));
    return node;
  }

  function renderTextCard(item) {
    const node = textTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".card-title").textContent = item.title;
    renderTextFields(node.querySelector("[data-text-fields]"), item.fields || []);
    return node;
  }

  function renderSummaryCard(item) {
    const node = summaryTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = item.title;
    node.querySelector("p").textContent = item.desc;
    node.querySelector("[data-action='enter']").addEventListener("click", () => {
      state.activeView = "tertiary." + item.productId + "." + item.list;
      openTertiaryNavForView(state.activeView);
      renderAll();
    });
    node.querySelector("[data-action='add']").addEventListener("click", () => {
      state.pendingAdd = { productId: item.productId, list: item.list };
      addFileInput.value = "";
      addFileInput.click();
    });
    return node;
  }

  function renderTextFields(container, fields) {
    container.innerHTML = "";
    fields.forEach((field) => {
      const label = document.createElement("label");
      if (field.multiline) label.className = "wide";
      label.textContent = field.label;
      const input = field.multiline ? document.createElement("textarea") : document.createElement("input");
      if (!field.multiline) input.type = "text";
      input.value = getPath(field.path) || "";
      input.addEventListener("input", () => setPath(field.path, input.value));
      label.appendChild(input);
      container.appendChild(label);
    });
  }

  function applyPreview(img, image) {
    img.onload = function () {
      fitManagedImage(img);
    };
    img.src = image.src;
    img.style.setProperty("--huan-image-scale", String(image.scale || 1));
    img.style.setProperty("--huan-object-position", (image.offsetX || 50) + "% " + (image.offsetY || 50) + "%");
    img.style.setProperty("--huan-offset-x", String(image.offsetX || 50));
    img.style.setProperty("--huan-offset-y", String(image.offsetY || 50));
    if (img.complete) {
      fitManagedImage(img);
    }
  }

  function fitManagedImage(img) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const frame = img.parentElement;
    const rect = frame && frame.getBoundingClientRect ? frame.getBoundingClientRect() : null;
    const frameWidth = rect && rect.width ? rect.width : 1;
    const frameHeight = rect && rect.height ? rect.height : 1;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const frameRatio = frameWidth / frameHeight;
    img.dataset.huanFit = imageRatio <= frameRatio ? "width" : "height";
  }

  function syncOutputs(node, image) {
    node.querySelector("[data-field='scale']").value = image.scale;
    node.querySelector("[data-field='offsetX']").value = image.offsetX;
    node.querySelector("[data-field='offsetY']").value = image.offsetY;
    node.querySelector("[data-output='scale']").value = Number(image.scale || 1).toFixed(2);
    node.querySelector("[data-output='offsetX']").value = Math.round(image.offsetX || 50);
    node.querySelector("[data-output='offsetY']").value = Math.round(image.offsetY || 50);
  }

  function updateImage(item, img, node, patch) {
    Object.assign(item.image, patch);
    item.image.scale = clamp(item.image.scale, 1, 0.5, 3);
    item.image.offsetX = clamp(item.image.offsetX, 50, 0, 100);
    item.image.offsetY = clamp(item.image.offsetY, 50, 0, 100);
    setPath(item.path, item.image);
    if (item.thumbPath && patch.src) setPath(item.thumbPath, Object.assign({}, item.image));
    applyPreview(img, item.image);
    syncOutputs(node, item.image);
  }

  function moveImage(direction, item, img, node) {
    const patch = {};
    if (direction === "left") patch.offsetX = clamp((item.image.offsetX || 50) - MOVE_STEP, 50, 0, 100);
    if (direction === "right") patch.offsetX = clamp((item.image.offsetX || 50) + MOVE_STEP, 50, 0, 100);
    if (direction === "up") patch.offsetY = clamp((item.image.offsetY || 50) - MOVE_STEP, 50, 0, 100);
    if (direction === "down") patch.offsetY = clamp((item.image.offsetY || 50) + MOVE_STEP, 50, 0, 100);
    updateImage(item, img, node, patch);
  }

  function removeItem(remove) {
    if (!remove) return;
    const list = getPath(remove.arrayPath);
    if (!Array.isArray(list)) return;
    list.splice(remove.index, 1);
    state.dirty = true;
    renderAll();
  }

  function addSecondaryProduct(productId, groupKey) {
    const list = state.config.secondary.products;
    list.push({
      productId,
      tag: "\u65b0\u54c1\u4e0a\u5e02",
      title: productId + " Product",
      desc: "\u8bf7\u586b\u5199\u5546\u54c1\u63cf\u8ff0\u3002",
      image: ensureImage(productImage(productId)),
    });
    const group = state.config.controllerGroups.secondary[groupKey];
    if (Array.isArray(group) && !group.includes(productId)) group.push(productId);
    state.dirty = true;
    renderAll();
  }

  function productDir(productId, type) {
    return "lv_assets/photo/" + productId + "/" + productId + "-" + type;
  }

  function dirForItem(item) {
    if (item.uploadTargetDir) return item.uploadTargetDir;
    const src = item.image && item.image.src ? item.image.src : "";
    if (src.includes("/")) return src.split("/").slice(0, -1).join("/");
    return "lv_assets/controller_uploads/" + (item.kind || "misc");
  }

  function homeUploadType(item) {
    if (!item || !item.path || !item.path.startsWith("home.")) return "";
    if (item.path.startsWith("home.heroSlides")) return "";
    if (item.path.startsWith("home.categories")) return "bai";
    return "mode";
  }

  function dirForUpload(file, item) {
    const productId = productIdFromFileName(file && file.name);
    const type = homeUploadType(item);
    if (productId && type) {
      return productDir(productId, type);
    }
    return dirForItem(item);
  }

  function syncHomeProductIdFromUpload(file, item) {
    const productId = productIdFromFileName(file && file.name);
    if (!productId || !item || !item.path || !item.path.startsWith("home.") || item.path.startsWith("home.heroSlides")) {
      return;
    }
    const productIdPath = item.path.replace(/\.image$/, ".productId");
    if (productIdPath !== item.path) {
      setPath(productIdPath, productId);
    }
  }

  function addTargetDir(info) {
    if (info.list === "gallery") return productDir(info.productId, "bai");
    if (info.list === "modelCards") return productDir(info.productId, "mode");
    return productDir(info.productId, "pdd");
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function uploadFile(file, targetDir) {
    if (!file) return null;
    setStatus(text.upload, "");
    const dataUrl = await readFileAsDataUrl(file);
    const response = await fetch(API + "/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, dataUrl, targetDir }),
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || text.failed);
    return result;
  }

  async function uploadReplacement(file, item, img, node, srcInput) {
    const result = await uploadFile(file, dirForUpload(file, item));
    if (!result) return;
    syncHomeProductIdFromUpload(file, item);
    updateImage(item, img, node, { src: result.src, scale: 1, offsetX: 50, offsetY: 50, isUploaded: true });
    srcInput.value = result.src;
    setStatus(text.uploadDone, "ok");
  }

  async function handleAddFile(file) {
    const info = state.pendingAdd;
    state.pendingAdd = null;
    if (!file || !info) return;
    const result = await uploadFile(file, addTargetDir(info));
    const product = state.config.tertiary.productCatalog[info.productId];
    const image = ensureImage(result.src);
    if (info.list === "gallery") product.gallery.push({ image: Object.assign({}, image), thumb: Object.assign({}, image) });
    if (info.list === "modelCards") product.modelCards.push({ title: "Model " + String(product.modelCards.length + 1).padStart(2, "0"), image });
    if (info.list === "detailImages") product.detailImages.push(image);
    state.dirty = true;
    setStatus(text.uploadDone, "ok");
    renderAll();
  }

  async function loadConfig() {
    setStatus(text.loading, "");
    const health = await fetch(API + "/health").then((res) => res.json());
    if (!health.ok || !String(health.projectFile || "").toLowerCase().includes(PROJECT_NAME.toLowerCase())) {
      throw new Error(text.wrongHelper + (health.projectFile || text.unknownPath));
    }
    const result = await fetch(API + "/config").then((res) => res.json());
    if (!result.ok) throw new Error(result.error || text.failed);
    state.config = parseConfig(result.content);
    ensureControllerConfig();
    state.configVersion = result.version || "";
    state.dirty = false;
    const activeTertiary = state.activeView.startsWith("tertiary.") ? parseTertiaryView().productId : "";
    if (activeTertiary) {
      state.openTertiaryGroups[tertiaryGroupForProduct(activeTertiary)] = true;
      state.openTertiaryProducts[activeTertiary] = true;
    }
    if (!isValidView(state.activeView)) state.activeView = "home.categories";
    renderAll();
    setStatus(text.connected + result.projectFile, "ok");
  }

  function isValidView(view) {
    if (!state.config) return false;
    if (homeGroups.some((group) => group.key === view)) return true;
    if (secondaryGroups.some((group) => view === "secondary." + group.key)) return true;
    const parts = view.split(".");
    return parts[0] === "tertiary" && state.config.tertiary.productCatalog[parts[1]] && ["overview", "gallery", "modelCards", "detailImages", "slices"].includes(parts[2]);
  }

  async function saveConfig() {
    if (!state.config) return;
    setStatus(text.checkingAssets, "");
    const response = await fetch(API + "/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: configText() }),
    });
    const result = await response.json();
    if (!result.ok) {
      const message = detailedAssetErrorMessage(result) || result.error || text.failed;
      console.error("[ASSET CHECK FAILED]", result.assetReport || result);
      alert(message);
      setStatus(text.assetFailed, "bad");
      throw new Error(message);
    }
    console.log("[ASSET CHECK PASSED] \u6240\u6709\u56fe\u7247\u8d44\u6e90\u68c0\u67e5\u901a\u8fc7", result.assetReport || {});
    setStatus(text.assetSafe, "ok");
    if (!String(result.projectFile || "").toLowerCase().includes(PROJECT_NAME.toLowerCase())) {
      throw new Error("\u4fdd\u5b58\u76ee\u6807\u4e0d\u662f\u5f53\u524d\u9879\u76ee\uff1a" + result.projectFile);
    }
    state.configVersion = result.version || state.configVersion;
    await loadConfig();
    setStatus(text.saved + (result.syncedSiteHtml ? "\u7f51\u9875\u9759\u6001\u56fe\u7247\u5df2\u540c\u6b65\u3002" : ""), "ok");
  }

  function assetErrorMessage(result) {
    const issues = result && result.assetReport && Array.isArray(result.assetReport.issues) ? result.assetReport.issues : [];
    if (!issues.length) return "";
    return "\u56fe\u7247\u8def\u5f84\u6821\u9a8c\u5931\u8d25\uff1a" + issues.slice(0, 5).map((issue) => {
      const product = issue.productId ? "商品 " + issue.productId + " " : "";
      return product + (issue.field || "\u672a\u77e5\u5b57\u6bb5") + " -> " + issue.path + " (" + issue.type + ")";
    }).join("；") + (issues.length > 5 ? "\u7b49 " + issues.length + " \u9879" : "");
  }

  function detailedAssetErrorMessage(result) {
    const issues = result && result.assetReport && Array.isArray(result.assetReport.issues) ? result.assetReport.issues : [];
    if (!issues.length) return "";
    issues.forEach((issue) => {
      console.error("[ASSET CHECK FAILED]\nproductId: " + (issue.productId || "N/A") +
        "\nproductName: " + (issue.productName || "N/A") +
        "\nfield: " + (issue.field || "N/A") +
        "\npath: " + (issue.path || "N/A") +
        "\nreason: " + (issue.reason || issue.type || "unknown") +
        "\nfix: " + (issue.fix || "\u8bf7\u91cd\u65b0\u4e0a\u4f20\u8be5\u56fe\u7247"));
    });
    return "[ASSET CHECK FAILED]\n" + issues.slice(0, 5).map((issue) => {
      return [
        "productId: " + (issue.productId || "N/A"),
        "productName: " + (issue.productName || "N/A"),
        "field: " + (issue.field || "N/A"),
        "path: " + (issue.path || "N/A"),
        "reason: " + (issue.reason || issue.type || "unknown"),
        "fix: " + (issue.fix || "\u8bf7\u91cd\u65b0\u4e0a\u4f20\u8be5\u56fe\u7247"),
      ].join("\n");
    }).join("\n\n") + (issues.length > 5 ? "\n\n\u5171 " + issues.length + " \u9879\u95ee\u9898\uff0c\u8bf7\u67e5\u770b\u63a7\u5236\u53f0\u5b8c\u6574\u6e05\u5355\u3002" : "");
  }

  function wire() {
    document.querySelector("[data-action='reload']").addEventListener("click", () => loadConfig().catch(showError));
    document.querySelector("[data-action='save']").addEventListener("click", () => saveConfig().catch(showError));
    searchNode.addEventListener("input", () => {
      state.search = searchNode.value;
      renderList();
    });
    addFileInput.addEventListener("change", () => handleAddFile(addFileInput.files && addFileInput.files[0]).catch(showError));
    window.addEventListener("beforeunload", (event) => {
      if (!state.dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  function showError(error) {
    setStatus(error && error.message ? error.message : text.failed, "bad");
  }

  wire();
  loadConfig().catch(showError);
})();
