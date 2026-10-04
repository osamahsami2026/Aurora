(() => {
  // ../aurora/aurora/public/js/aurora_web.bundle.js
  (function() {
    var KEY = "aurora:settings";
    var root = document.documentElement;
    if (!root)
      return;
    var saved;
    try {
      saved = JSON.parse(window.localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return;
    }
    if (!saved || typeof saved !== "object")
      return;
    if (typeof saved.hue === "number") {
      root.style.setProperty("--aurora-h", String(saved.hue));
    }
    if (typeof saved.sat === "number") {
      root.style.setProperty("--aurora-s", saved.sat + "%");
    }
    if (saved.shape)
      root.setAttribute("data-aurora-shape", saved.shape);
    if (saved.font)
      root.setAttribute("data-aurora-font", saved.font);
    if (saved.font_custom) {
      root.style.setProperty(
        "--aurora-font-custom",
        '"' + String(saved.font_custom).replace(/"/g, "") + '"'
      );
    }
    if (saved.features && saved.features.gradients === false) {
      root.setAttribute("data-aurora-gradients", "0");
    }
  })();
  (function() {
    if (!window.MutationObserver)
      return;
    function watch() {
      if (!document.body)
        return;
      var observer = new MutationObserver(function() {
        if (!document.querySelector(".splash"))
          return;
        observer.disconnect();
        try {
          window.sessionStorage.setItem("aurora:signed-in", "1");
        } catch (e) {
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.body)
      watch();
    else
      document.addEventListener("DOMContentLoaded", watch, { once: true });
  })();
})();
//# sourceMappingURL=aurora_web.bundle.67IXTU4U.js.map
