(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../aurora/aurora/public/js/theme/settings.js
  var settings_exports = {};
  __export(settings_exports, {
    ACCENTS: () => ACCENTS,
    FEATURES: () => FEATURES,
    TOAST_POSITIONS: () => TOAST_POSITIONS,
    apply: () => apply,
    feature: () => feature,
    get: () => get,
    get_mode: () => get_mode,
    hydrate_from_boot: () => hydrate_from_boot,
    reset: () => reset,
    set: () => set,
    set_feature: () => set_feature,
    set_mode: () => set_mode
  });
  var STORAGE_KEY = "aurora:settings";
  var SAVE_METHOD = "aurora.api.save_theme";
  var SAVE_DEBOUNCE = 700;
  var FEATURES = [
    { key: "page_transitions", label: "Page transitions", hint: "Animate route changes" },
    { key: "progress_bar", label: "Loading bar", hint: "Top progress indicator" },
    { key: "ripple", label: "Click ripples", hint: "Touch feedback on buttons" },
    { key: "reveal", label: "Staggered lists", hint: "Rows fade in as you scroll" },
    { key: "tilt", label: "Card sheen", hint: "Cards light up under the cursor" },
    { key: "counters", label: "Number count-up", hint: "Animate dashboard figures" },
    { key: "condensed_header", label: "Condensing header", hint: "Header lifts on scroll" },
    { key: "back_to_top", label: "Back to top", hint: "Scroll button with progress ring" },
    { key: "toast_timers", label: "Toast timers", hint: "Show how long a message stays" },
    { key: "save_pulse", label: "Save feedback", hint: "Pulse the status pill on save" },
    { key: "palette", label: "Quick actions", hint: "Ctrl+Shift+K command palette" },
    { key: "charts", label: "Chart theming", hint: "Recolour charts to your accent" },
    { key: "cards", label: "Card styling", hint: "Accent edge, halo and hover lift" },
    { key: "app_icons", label: "Tint app icons", hint: "Recolour app logos to your accent" },
    { key: "dock_autohide", label: "Auto-hide dock", hint: "Retract these buttons until hovered" },
    { key: "gradients", label: "Gradients", hint: "Off = flat accent on buttons, checkboxes" },
    { key: "quicklook", label: "Quick Look", hint: "Hover to peek, Space to open" },
    { key: "signin_entrance", label: "Sign-in entrance", hint: "Animate the way into the desk" }
  ];
  var DEFAULT_FEATURES = FEATURES.reduce((acc, f) => __spreadProps(__spreadValues({}, acc), { [f.key]: true }), {});
  var DEFAULTS = {
    hue: 256,
    sat: 84,
    shape: "soft",
    density: "cozy",
    font: "system",
    font_custom: "",
    motion: "on",
    ambient: "subtle",
    toast_position: "bottom-right",
    features: __spreadValues({}, DEFAULT_FEATURES)
  };
  var TOAST_POSITIONS = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right"
  ];
  var ACCENTS = [
    { label: "Indigo", hue: 256 },
    { label: "Violet", hue: 282 },
    { label: "Fuchsia", hue: 316 },
    { label: "Rose", hue: 346 },
    { label: "Amber", hue: 32 },
    { label: "Emerald", hue: 158 },
    { label: "Teal", hue: 186 },
    { label: "Ocean", hue: 212 }
  ];
  var state = __spreadProps(__spreadValues({}, DEFAULTS), { features: __spreadValues({}, DEFAULT_FEATURES) });
  var save_timer = null;
  function merge(base, patch) {
    if (!patch || typeof patch !== "object")
      return base;
    return __spreadProps(__spreadValues(__spreadValues({}, base), patch), {
      features: __spreadValues(__spreadValues({}, base.features), patch.features || {})
    });
  }
  function migrate(saved) {
    if (saved && typeof saved.backdrop === "boolean" && !saved.ambient) {
      saved = __spreadProps(__spreadValues({}, saved), { ambient: saved.backdrop ? "subtle" : "off" });
      delete saved.backdrop;
    }
    return saved;
  }
  function read_local() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw)
        state = merge(state, migrate(JSON.parse(raw)));
    } catch (e) {
    }
  }
  function write_local() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
    }
  }
  function write_server() {
    clearTimeout(save_timer);
    save_timer = setTimeout(() => {
      var _a, _b;
      if (!((_a = window.frappe) == null ? void 0 : _a.xcall) || ((_b = frappe.session) == null ? void 0 : _b.user) === "Guest")
        return;
      frappe.xcall(SAVE_METHOD, { settings: JSON.stringify(state) }).catch(() => {
      });
    }, SAVE_DEBOUNCE);
  }
  function get() {
    return __spreadProps(__spreadValues({}, state), { features: __spreadValues({}, state.features) });
  }
  function feature(key) {
    return state.features[key] !== false;
  }
  function apply() {
    const root = document.documentElement;
    if (!root)
      return;
    root.style.setProperty("--aurora-h", String(state.hue));
    root.style.setProperty("--aurora-s", `${state.sat}%`);
    root.setAttribute("data-aurora-shape", state.shape);
    root.setAttribute("data-aurora-density", state.density);
    root.setAttribute("data-aurora-font", state.font);
    root.style.setProperty(
      "--aurora-font-custom",
      state.font_custom ? `"${String(state.font_custom).replace(/"/g, "")}"` : ""
    );
    root.setAttribute("data-aurora-motion", state.motion);
    root.setAttribute("data-aurora-ambient", state.ambient);
    root.setAttribute(
      "data-aurora-toast-pos",
      TOAST_POSITIONS.includes(state.toast_position) ? state.toast_position : DEFAULTS.toast_position
    );
    FEATURES.forEach(({ key }) => {
      root.setAttribute(`data-aurora-${key.replace(/_/g, "-")}`, feature(key) ? "1" : "0");
    });
    document.dispatchEvent(new CustomEvent("aurora:settings", { detail: get() }));
  }
  function set(patch, { persist = true, sync: sync2 = true } = {}) {
    state = merge(state, patch);
    if (persist)
      write_local();
    if (persist && sync2)
      write_server();
    apply();
    return get();
  }
  function set_feature(key, on) {
    return set({ features: { [key]: !!on } });
  }
  function reset() {
    state = __spreadProps(__spreadValues({}, DEFAULTS), { features: __spreadValues({}, DEFAULT_FEATURES) });
    write_local();
    write_server();
    apply();
    return get();
  }
  function hydrate_from_boot() {
    var _a, _b;
    const remote = migrate((_b = (_a = window.frappe) == null ? void 0 : _a.boot) == null ? void 0 : _b.aurora_theme);
    if (!remote || !Object.keys(remote).length) {
      write_server();
      return;
    }
    const before = JSON.stringify(state);
    state = merge(state, remote);
    if (JSON.stringify(state) !== before) {
      write_local();
      apply();
    }
  }
  function get_mode() {
    return document.documentElement.getAttribute("data-theme-mode") || "light";
  }
  function set_mode(mode) {
    var _a, _b, _c, _d;
    const root = document.documentElement;
    root.setAttribute("data-theme-mode", mode);
    if ((_b = (_a = window.frappe) == null ? void 0 : _a.ui) == null ? void 0 : _b.set_theme) {
      frappe.ui.set_theme(mode === "automatic" ? void 0 : mode);
    } else {
      root.setAttribute("data-theme", mode);
    }
    if (((_c = window.frappe) == null ? void 0 : _c.xcall) && ((_d = frappe.session) == null ? void 0 : _d.user) !== "Guest") {
      const title = mode.charAt(0).toUpperCase() + mode.slice(1);
      frappe.xcall("frappe.core.doctype.user.user.switch_theme", { theme: title }).catch(() => {
      });
    }
    document.dispatchEvent(new CustomEvent("aurora:mode", { detail: mode }));
    return mode;
  }
  read_local();
  apply();

  // ../aurora/aurora/public/js/theme/backdrop.js
  var backdrop_exports = {};
  __export(backdrop_exports, {
    init: () => init
  });

  // ../aurora/aurora/public/js/theme/utils.js
  function motion_off() {
    const root = document.documentElement;
    if (root.getAttribute("data-aurora-motion") === "off")
      return true;
    return root.getAttribute("data-aurora-motion") !== "on" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function raf_throttle(fn) {
    let queued = false;
    let last_args;
    return function(...args) {
      last_args = args;
      if (queued)
        return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        fn.apply(this, last_args);
      });
    };
  }
  function debounce(fn, wait = 120) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  var ICONS = {
    sparkles: `<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z"/>`,
    sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
    moon: `<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>`,
    command: `<path d="M6 3a3 3 0 013 3v12a3 3 0 11-3-3h12a3 3 0 11-3 3V6a3 3 0 113 3H6a3 3 0 01-3-3z"/>`,
    search: `<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>`,
    arrow_up: `<path d="M12 19V5M5 12l7-7 7 7"/>`,
    close: `<path d="M18 6L6 18M6 6l12 12"/>`,
    chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`
  };
  function icon(name, size = 18) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
		stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
		stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }
  function on_app_ready(fn) {
    var _a;
    if ((_a = window.frappe) == null ? void 0 : _a.app) {
      fn();
      return;
    }
    $(document).on("app_ready", () => fn());
  }

  // ../aurora/aurora/public/js/theme/backdrop.js
  var over = null;
  function sync() {
    const wanted = get().ambient === "vivid" && !motion_off();
    if (wanted && !over) {
      over = document.createElement("div");
      over.className = "aurora-backdrop-over";
      over.setAttribute("aria-hidden", "true");
      document.body.appendChild(over);
    } else if (!wanted && over) {
      over.remove();
      over = null;
    }
  }
  function init() {
    sync();
    document.addEventListener("aurora:settings", sync);
    document.addEventListener("aurora:mode", sync);
  }

  // ../aurora/aurora/public/js/theme/progress.js
  var progress_exports = {};
  __export(progress_exports, {
    done: () => done,
    init: () => init2,
    start: () => start
  });
  var bar = null;
  var wrapper = null;
  var progress = 0;
  var timer = null;
  var inflight = 0;
  function mount() {
    if (wrapper)
      return;
    wrapper = document.createElement("div");
    wrapper.className = "aurora-progress";
    wrapper.innerHTML = `<div class="aurora-progress-bar"></div>`;
    document.body.appendChild(wrapper);
    bar = wrapper.querySelector(".aurora-progress-bar");
  }
  function render() {
    if (bar)
      bar.style.width = `${progress}%`;
  }
  function start() {
    mount();
    if (timer)
      return;
    progress = 8;
    wrapper.classList.add("active");
    render();
    timer = setInterval(() => {
      const remaining = 90 - progress;
      progress += Math.max(0.4, remaining * 0.08);
      render();
    }, 180);
  }
  function done() {
    if (!wrapper)
      return;
    clearInterval(timer);
    timer = null;
    progress = 100;
    render();
    setTimeout(() => {
      wrapper.classList.remove("active");
      setTimeout(() => {
        progress = 0;
        render();
      }, 220);
    }, 180);
  }
  function init2() {
    var _a, _b;
    mount();
    if ((_b = (_a = window.frappe) == null ? void 0 : _a.router) == null ? void 0 : _b.on) {
      frappe.router.on("change", () => start());
    }
    $(document).on("page-change", () => done());
    $(document).on("ajaxSend", () => {
      inflight += 1;
      if (inflight === 1)
        start();
    });
    $(document).on("ajaxComplete", () => {
      inflight = Math.max(0, inflight - 1);
      if (inflight === 0)
        done();
    });
    window.addEventListener("error", () => done());
  }

  // ../aurora/aurora/public/js/theme/transitions.js
  var transitions_exports = {};
  __export(transitions_exports, {
    init: () => init3
  });
  var went_back = false;
  function animate_current() {
    if (motion_off())
      return;
    const page = document.querySelector(".page-container:not([style*='display: none'])");
    if (!page)
      return;
    const cls = went_back ? "aurora-page-enter-back" : "aurora-page-enter";
    went_back = false;
    page.classList.remove("aurora-page-enter", "aurora-page-enter-back");
    void page.offsetWidth;
    page.classList.add(cls);
    page.addEventListener(
      "animationend",
      () => page.classList.remove(cls),
      { once: true }
    );
  }
  function init3() {
    window.addEventListener("popstate", () => {
      went_back = true;
    });
    $(document).on("page-change", animate_current);
  }

  // ../aurora/aurora/public/js/theme/ripple.js
  var ripple_exports = {};
  __export(ripple_exports, {
    init: () => init4
  });
  var SELECTOR = [
    ".btn",
    ".aurora-dock-btn",
    ".sidebar-item-container .item-anchor",
    ".dropdown-item",
    ".widget.shortcut-widget-box",
    ".point-of-sale-app .item-wrapper",
    ".point-of-sale-app .numpad-btn"
  ].join(",");
  function spawn(event) {
    if (motion_off())
      return;
    const target = event.target.closest(SELECTOR);
    if (!target || target.disabled || target.classList.contains("disabled"))
      return;
    const style = window.getComputedStyle(target);
    if (style.position === "static")
      target.style.position = "relative";
    if (style.overflow === "visible")
      target.style.overflow = "hidden";
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "aurora-ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    setTimeout(() => ripple.remove(), 900);
  }
  function init4() {
    document.addEventListener("pointerdown", spawn, { passive: true });
  }

  // ../aurora/aurora/public/js/theme/reveal.js
  var reveal_exports = {};
  __export(reveal_exports, {
    init: () => init5
  });
  var TARGETS = [
    ".frappe-list .list-row-container",
    ".widget-group .widget",
    ".new-timeline .timeline-item",
    ".navbar-breadcrumbs li",
    ".body-sidebar .sidebar-items > .sidebar-item-container"
  ];
  var observer = null;
  function reveal(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting)
        return;
      entry.target.classList.add("aurora-revealed");
      observer.unobserve(entry.target);
    });
  }
  function index_group(nodes) {
    nodes.forEach((node, i) => {
      node.style.setProperty("--aurora-i", String(Math.min(i, 14)));
    });
  }
  var scan = debounce(() => {
    if (motion_off() || !observer)
      return;
    TARGETS.forEach((selector) => {
      const nodes = Array.from(document.querySelectorAll(selector)).filter(
        (n) => !n.classList.contains("aurora-reveal")
      );
      if (!nodes.length)
        return;
      index_group(nodes);
      nodes.forEach((node) => {
        node.classList.add("aurora-reveal");
        observer.observe(node);
      });
    });
  }, 60);
  function init5() {
    if (!("IntersectionObserver" in window))
      return;
    observer = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.02
    });
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    $(document).on("page-change", scan);
    scan();
  }

  // ../aurora/aurora/public/js/theme/tilt.js
  var tilt_exports = {};
  __export(tilt_exports, {
    init: () => init6
  });
  var SELECTOR2 = ".widget, .form-links .document-link, .plant-floor-container .workstation-card";
  var move = raf_throttle((event) => {
    const card = event.target.closest(SELECTOR2);
    if (!card)
      return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--aurora-mx", `${(event.clientX - rect.left) / rect.width * 100}%`);
    card.style.setProperty("--aurora-my", `${(event.clientY - rect.top) / rect.height * 100}%`);
  });
  function init6() {
    document.addEventListener(
      "pointermove",
      (event) => {
        if (motion_off())
          return;
        move(event);
      },
      { passive: true }
    );
  }

  // ../aurora/aurora/public/js/theme/counters.js
  var counters_exports = {};
  __export(counters_exports, {
    init: () => init7
  });
  var DURATION = 900;
  var NUMBER_RE = /-?[\d.,]+/;
  function ease_out(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function count_up(el2) {
    const text = el2.textContent.trim();
    const match = text.match(NUMBER_RE);
    if (!match)
      return;
    const raw = match[0];
    const decimal_sep = raw.lastIndexOf(",") > raw.lastIndexOf(".") ? "," : ".";
    const group_sep = decimal_sep === "," ? "." : ",";
    const numeric = parseFloat(
      raw.split(group_sep).join("").split(decimal_sep).join(".")
    );
    if (!isFinite(numeric) || Math.abs(numeric) < 1)
      return;
    const decimals = (raw.split(decimal_sep)[1] || "").length;
    const start3 = performance.now();
    el2.classList.add("aurora-counting");
    function frame(now) {
      const t = Math.min(1, (now - start3) / DURATION);
      const value = numeric * ease_out(t);
      const shown = value.toLocaleString(void 0, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      el2.textContent = text.replace(NUMBER_RE, shown);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el2.textContent = text;
        el2.classList.remove("aurora-counting");
      }
    }
    requestAnimationFrame(frame);
  }
  function init7() {
    if (!("IntersectionObserver" in window))
      return;
    const observer2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting)
            return;
          observer2.unobserve(entry.target);
          count_up(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    const watch2 = () => {
      if (motion_off())
        return;
      document.querySelectorAll(".widget.number-widget-box .number:not([data-aurora-counted])").forEach((el2) => {
        el2.setAttribute("data-aurora-counted", "1");
        observer2.observe(el2);
      });
    };
    new MutationObserver(() => watch2()).observe(document.body, {
      childList: true,
      subtree: true
    });
    $(document).on("page-change", watch2);
    watch2();
  }

  // ../aurora/aurora/public/js/theme/page_head.js
  var page_head_exports = {};
  __export(page_head_exports, {
    init: () => init8
  });
  var THRESHOLD = 20;
  function scroll_container() {
    return document.querySelector(".layout-main-section-wrapper:not(.disable-scrolling)") || null;
  }
  var update = raf_throttle(() => {
    const wrapper2 = scroll_container();
    const offset = Math.max(
      window.scrollY || 0,
      wrapper2 ? wrapper2.scrollTop || 0 : 0
    );
    document.querySelectorAll(".page-head").forEach((head) => {
      head.classList.toggle("aurora-condensed", offset > THRESHOLD);
    });
  });
  function init8() {
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });
    $(document).on("page-change", update);
    update();
  }

  // ../aurora/aurora/public/js/theme/scroll_top.js
  var scroll_top_exports = {};
  __export(scroll_top_exports, {
    init: () => init9
  });
  var el = null;
  function scroller() {
    return document.querySelector(".layout-main-section-wrapper:not(.disable-scrolling)");
  }
  function metrics() {
    const wrapper2 = scroller();
    if (wrapper2 && wrapper2.scrollHeight > wrapper2.clientHeight + 40) {
      return {
        node: wrapper2,
        top: wrapper2.scrollTop,
        max: wrapper2.scrollHeight - wrapper2.clientHeight
      };
    }
    const doc = document.documentElement;
    return {
      node: window,
      top: window.scrollY || doc.scrollTop || 0,
      max: Math.max(1, doc.scrollHeight - window.innerHeight)
    };
  }
  var update2 = raf_throttle(() => {
    if (!el)
      return;
    const { top, max } = metrics();
    el.classList.toggle("visible", top > 320);
    el.style.setProperty("--aurora-scroll", String(Math.min(1, top / max)));
  });
  function to_top() {
    const { node } = metrics();
    const options = { top: 0, behavior: "smooth" };
    node === window ? window.scrollTo(options) : node.scrollTo(options);
  }
  function init9() {
    el = document.createElement("button");
    el.className = "aurora-to-top";
    el.type = "button";
    el.setAttribute("aria-label", "Back to top");
    el.innerHTML = `<span class="aurora-to-top-ring"></span>${icon("arrow_up", 17)}`;
    el.addEventListener("click", to_top);
    document.body.appendChild(el);
    window.addEventListener("scroll", update2, { passive: true });
    document.addEventListener("scroll", update2, { passive: true, capture: true });
    $(document).on("page-change", update2);
    update2();
  }

  // ../aurora/aurora/public/js/theme/toasts.js
  var toasts_exports = {};
  __export(toasts_exports, {
    init: () => init10
  });
  function decorate($div, seconds) {
    const node = $div && $div[0];
    if (!node || node.querySelector(".aurora-toast-timer"))
      return;
    node.style.setProperty("--aurora-toast-life", `${seconds}s`);
    if (window.getComputedStyle(node).position === "static") {
      node.style.position = "relative";
    }
    const timer2 = document.createElement("div");
    timer2.className = "aurora-toast-timer";
    node.appendChild(timer2);
  }
  function init10() {
    var _a;
    if (!((_a = window.frappe) == null ? void 0 : _a.show_alert) || frappe.show_alert.__aurora)
      return;
    const original = frappe.show_alert;
    function wrapped(message, seconds = 7, actions = {}) {
      const $div = original.call(this, message, seconds, actions);
      if (!motion_off()) {
        const life = seconds > 2 ? seconds - 0.8 : seconds;
        try {
          decorate($div, life);
        } catch (e) {
        }
      }
      return $div;
    }
    wrapped.__aurora = true;
    frappe.show_alert = wrapped;
    frappe.toast = wrapped;
  }

  // ../aurora/aurora/public/js/theme/recents.js
  var recents_exports = {};
  __export(recents_exports, {
    init: () => init11,
    list: () => list,
    record: () => record
  });
  var KEY = "aurora:recents";
  var LIMIT = 12;
  var trail = [];
  function load() {
    try {
      trail = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    } catch (e) {
      trail = [];
    }
  }
  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(trail.slice(0, LIMIT)));
    } catch (e) {
    }
  }
  function title_for(route) {
    if (!route || !route.length)
      return "Home";
    const [view, doctype, name] = route;
    if (view === "Form")
      return `${doctype}: ${name}`;
    if (view === "List")
      return `${doctype} list`;
    if (view === "query-report")
      return `${doctype} (report)`;
    if (view === "workspace" || route.length === 1) {
      return frappe.utils.to_title_case((doctype || view).replace(/-/g, " "));
    }
    return route.map((r) => String(r)).join(" / ");
  }
  function record() {
    var _a;
    const route = (_a = frappe.get_route) == null ? void 0 : _a.call(frappe);
    if (!route || !route.length)
      return;
    const key = route.join("/");
    trail = trail.filter((r) => r.key !== key);
    trail.unshift({
      key,
      route: route.slice(),
      label: title_for(route),
      at: Date.now()
    });
    trail = trail.slice(0, LIMIT);
    save();
  }
  function list() {
    return trail.slice();
  }
  function init11() {
    load();
    $(document).on("page-change", () => {
      try {
        record();
      } catch (e) {
      }
    });
  }

  // ../aurora/aurora/public/js/theme/palette.js
  var palette_exports = {};
  __export(palette_exports, {
    close: () => close,
    init: () => init12,
    open: () => open
  });
  var $backdrop = null;
  var $input = null;
  var $list = null;
  var items = [];
  var selected = 0;
  var is_open = false;
  function theme_commands() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return [
      {
        group: "Theme",
        label: dark ? "Switch to light mode" : "Switch to dark mode",
        hint: "Appearance",
        mark: dark ? "\u2600" : "\u263E",
        run: () => set_mode(dark ? "light" : "dark")
      },
      {
        group: "Theme",
        label: "Open appearance settings",
        hint: "Accent, density, corners",
        mark: "\u2726",
        run: () => document.dispatchEvent(new CustomEvent("aurora:open-panel"))
      },
      {
        group: "Theme",
        label: "Toggle animations",
        hint: get().motion === "on" ? "Currently on" : "Currently off",
        mark: "\u27F3",
        run: () => set({ motion: get().motion === "on" ? "off" : "on" })
      }
    ];
  }
  function document_commands() {
    var _a;
    const frm = window.cur_frm;
    if (!frm || !frm.doc || ((_a = frappe.get_route()) == null ? void 0 : _a[0]) !== "Form")
      return [];
    const label = `${frm.doctype} ${frm.docname}`;
    const cmds = [
      {
        group: "This document",
        label: "Save",
        hint: label,
        mark: "\u2318S",
        run: () => frm.save()
      },
      {
        group: "This document",
        label: "Copy link",
        hint: label,
        mark: "\u{1F517}",
        run: () => {
          frappe.utils.copy_to_clipboard(window.location.href);
        }
      },
      {
        group: "This document",
        label: "Print",
        hint: label,
        mark: "\u{1F5A8}",
        run: () => frappe.set_route("print", frm.doctype, frm.docname)
      },
      {
        group: "This document",
        label: "Open list view",
        hint: frm.doctype,
        mark: "\u2261",
        run: () => frappe.set_route("List", frm.doctype)
      }
    ];
    if (frappe.model.can_create(frm.doctype)) {
      cmds.push({
        group: "This document",
        label: "Duplicate",
        hint: label,
        mark: "\u29C9",
        run: () => frm.copy_doc()
      });
    }
    return cmds;
  }
  function recent_commands() {
    return list().slice(1, 7).map((r) => ({
      group: "Recent",
      label: r.label,
      hint: "Jump back",
      mark: "\u21A9",
      run: () => frappe.set_route(r.route)
    }));
  }
  function workspace_commands() {
    return Array.from(
      document.querySelectorAll(".body-sidebar .sidebar-items .item-anchor[href]")
    ).map((a) => {
      var _a;
      return {
        group: "Workspaces",
        label: (((_a = a.querySelector(".sidebar-item-label")) == null ? void 0 : _a.textContent) || "").trim(),
        hint: "Workspace",
        mark: "\u25E7",
        href: a.getAttribute("href")
      };
    }).filter((c) => c.label).map((c) => __spreadProps(__spreadValues({}, c), { run: () => frappe.set_route(c.href.replace(/^\/app\/?/, "")) }));
  }
  function doctype_commands(query) {
    var _a, _b, _c, _d;
    if (!query || query.length < 2)
      return [];
    const q = query.toLowerCase();
    const can_read = ((_b = (_a = frappe.boot) == null ? void 0 : _a.user) == null ? void 0 : _b.can_read) || [];
    const can_create = ((_d = (_c = frappe.boot) == null ? void 0 : _c.user) == null ? void 0 : _d.can_create) || [];
    const out = [];
    for (const dt of can_read) {
      if (out.length >= 10)
        break;
      if (!dt.toLowerCase().includes(q))
        continue;
      out.push({
        group: "Go to",
        label: `${dt} list`,
        hint: "List view",
        mark: "\u2261",
        run: () => frappe.set_route("List", dt)
      });
      if (can_create.includes(dt)) {
        out.push({
          group: "Create",
          label: `New ${dt}`,
          hint: "Create a record",
          mark: "\uFF0B",
          run: () => frappe.new_doc(dt)
        });
      }
    }
    return out;
  }
  function collect(query) {
    const all = [
      ...document_commands(),
      ...recent_commands(),
      ...workspace_commands(),
      ...theme_commands(),
      ...doctype_commands(query)
    ];
    if (!query)
      return all.slice(0, 18);
    const q = query.toLowerCase();
    return all.map((c) => {
      const label = c.label.toLowerCase();
      let score = -1;
      if (label.startsWith(q))
        score = 0;
      else if (label.includes(q))
        score = 1;
      else if (subsequence(label, q))
        score = 2;
      return __spreadProps(__spreadValues({}, c), { score });
    }).filter((c) => c.score >= 0).sort((a, b) => a.score - b.score).slice(0, 18);
  }
  function subsequence(haystack, needle) {
    let i = 0;
    for (const ch of haystack) {
      if (ch === needle[i])
        i += 1;
      if (i === needle.length)
        return true;
    }
    return false;
  }
  function render2(query) {
    items = collect(query);
    selected = 0;
    if (!items.length) {
      $list.innerHTML = `<div class="aurora-palette-empty">
			No actions match \u201C${frappe.utils.escape_html(query || "")}\u201D.</div>`;
      return;
    }
    let html = "";
    let group = null;
    items.forEach((item, i) => {
      if (item.group !== group) {
        group = item.group;
        html += `<div class="aurora-palette-group">${group}</div>`;
      }
      html += `<div class="aurora-palette-item ${i === 0 ? "selected" : ""}"
			data-index="${i}" style="--aurora-i:${Math.min(i, 12)}">
			<span class="aurora-palette-icon">${item.mark || "\u2022"}</span>
			<span class="aurora-palette-label">${frappe.utils.escape_html(item.label)}</span>
			<span class="aurora-palette-meta">${frappe.utils.escape_html(item.hint || "")}</span>
		</div>`;
    });
    $list.innerHTML = html;
  }
  function move2(delta) {
    if (!items.length)
      return;
    selected = (selected + delta + items.length) % items.length;
    $list.querySelectorAll(".aurora-palette-item").forEach((el2) => {
      const on = Number(el2.dataset.index) === selected;
      el2.classList.toggle("selected", on);
      if (on)
        el2.scrollIntoView({ block: "nearest" });
    });
  }
  function run(index = selected) {
    const item = items[index];
    if (!item)
      return;
    close();
    try {
      item.run();
    } catch (e) {
      console.error("[aurora] command failed", e);
    }
  }
  function open() {
    if (!$backdrop)
      build();
    is_open = true;
    $backdrop.classList.add("open");
    $input.value = "";
    render2("");
    setTimeout(() => $input.focus(), 40);
  }
  function close() {
    if (!$backdrop)
      return;
    is_open = false;
    $backdrop.classList.remove("open");
  }
  function build() {
    $backdrop = document.createElement("div");
    $backdrop.className = "aurora-palette-backdrop";
    $backdrop.innerHTML = `
		<div class="aurora-palette" role="dialog" aria-label="Quick actions">
			<div class="aurora-palette-input-row">
				${icon("search")}
				<input type="text" placeholder="Type a command, doctype or workspace\u2026"
					aria-label="Quick actions" autocomplete="off" spellcheck="false">
			</div>
			<div class="aurora-palette-list"></div>
			<div class="aurora-palette-footer">
				<span><span class="aurora-kbd">\u2191\u2193</span> navigate</span>
				<span><span class="aurora-kbd">\u21B5</span> run</span>
				<span><span class="aurora-kbd">esc</span> close</span>
			</div>
		</div>`;
    document.body.appendChild($backdrop);
    $input = $backdrop.querySelector("input");
    $list = $backdrop.querySelector(".aurora-palette-list");
    $input.addEventListener("input", () => render2($input.value.trim()));
    $input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move2(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move2(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        run();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    });
    $list.addEventListener("click", (e) => {
      const row = e.target.closest(".aurora-palette-item");
      if (row)
        run(Number(row.dataset.index));
    });
    $backdrop.addEventListener("pointerdown", (e) => {
      if (e.target === $backdrop)
        close();
    });
  }
  function init12() {
    var _a, _b, _c;
    const action = () => {
      if (!feature("palette"))
        return false;
      is_open ? close() : open();
      return true;
    };
    if ((_c = (_b = (_a = window.frappe) == null ? void 0 : _a.ui) == null ? void 0 : _b.keys) == null ? void 0 : _c.add_shortcut) {
      ["shift+ctrl+k", "ctrl+shift+k"].forEach((shortcut) => {
        frappe.ui.keys.add_shortcut({
          shortcut,
          action,
          description: __("Open Aurora quick actions"),
          ignore_inputs: true
        });
      });
    } else {
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
          e.preventDefault();
          action();
        }
      });
    }
  }

  // ../aurora/aurora/public/js/theme/dock.js
  var dock_exports = {};
  __export(dock_exports, {
    init: () => init13,
    toggle_charts: () => toggle_charts,
    toggle_mode: () => toggle_mode,
    toggle_panel: () => toggle_panel
  });

  // ../aurora/aurora/public/js/theme/fonts.js
  var GOOGLE_LINK_ID = "aurora-google-font";
  var PROBE_TEXT = "mmmmmmmmmmlli";
  var BASES = ["monospace", "serif", "sans-serif"];
  function is_installed(family) {
    if (!family)
      return false;
    const span = document.createElement("span");
    span.textContent = PROBE_TEXT;
    span.setAttribute("aria-hidden", "true");
    span.style.cssText = "position:absolute;left:-9999px;top:-9999px;font-size:72px;white-space:nowrap;";
    document.body.appendChild(span);
    try {
      const baseline = {};
      for (const base of BASES) {
        span.style.fontFamily = base;
        baseline[base] = span.offsetWidth;
      }
      for (const base of BASES) {
        span.style.fontFamily = `"${family}",${base}`;
        if (span.offsetWidth !== baseline[base])
          return true;
      }
      return false;
    } finally {
      span.remove();
    }
  }
  function google_url(family) {
    const name = family.trim().replace(/\s+/g, "+");
    return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      name
    ).replace(/%2B/g, "+")}:wght@400;500;600;700&display=swap`;
  }
  function load_from_google(family) {
    return new Promise((resolve2) => {
      var _a;
      if (!family || !document.fonts)
        return resolve2(false);
      (_a = document.getElementById(GOOGLE_LINK_ID)) == null ? void 0 : _a.remove();
      const link = document.createElement("link");
      link.id = GOOGLE_LINK_ID;
      link.rel = "stylesheet";
      link.href = google_url(family);
      link.onerror = () => resolve2(false);
      link.onload = () => {
        document.fonts.load(`400 16px "${family}"`).then(() => resolve2(document.fonts.check(`16px "${family}"`))).catch(() => resolve2(false));
      };
      document.head.appendChild(link);
      setTimeout(() => resolve2(document.fonts.check(`16px "${family}"`)), 4e3);
    });
  }
  async function resolve(family) {
    if (!family || !family.trim())
      return "missing";
    if (is_installed(family))
      return "local";
    return await load_from_google(family) ? "google" : "missing";
  }
  function can_enumerate() {
    return typeof window.queryLocalFonts === "function";
  }
  async function list_installed() {
    if (!can_enumerate())
      return [];
    try {
      const faces = await window.queryLocalFonts();
      return [...new Set(faces.map((f) => f.family))].sort(
        (a, b) => a.localeCompare(b)
      );
    } catch (e) {
      return [];
    }
  }
  var SYSTEM_CANDIDATES = [
    "SF Pro Text",
    "SF Pro Display",
    "Helvetica Neue",
    "Segoe UI Variable Text",
    "Segoe UI",
    "Roboto",
    "Arial",
    "Avenir Next",
    "Optima",
    "Georgia",
    "Times New Roman",
    "Menlo",
    "Consolas",
    "SF Mono",
    "Courier New"
  ];
  var GOOGLE_SUGGESTIONS = [
    "Inter",
    "Manrope",
    "DM Sans",
    "Plus Jakarta Sans",
    "Outfit",
    "Sora",
    "Figtree",
    "Public Sans",
    "Work Sans",
    "Rubik",
    "Karla",
    "Nunito Sans",
    "Source Sans 3",
    "IBM Plex Sans",
    "Space Grotesk",
    "Geist",
    "Lexend",
    "Poppins",
    "Montserrat",
    "Raleway",
    "Playfair Display",
    "Merriweather",
    "Lora",
    "JetBrains Mono",
    "Fira Code",
    "IBM Plex Mono",
    "Cairo",
    "Tajawal",
    "IBM Plex Sans Arabic",
    "Noto Sans Arabic",
    "Almarai"
  ];
  function suggestions() {
    const local = SYSTEM_CANDIDATES.filter(is_installed);
    return { local, google: GOOGLE_SUGGESTIONS };
  }

  // ../aurora/aurora/public/js/theme/dock.js
  var $dock = null;
  var $panel = null;
  var open2 = false;
  var tab = "look";
  function segmented(field, options, current2) {
    const buttons = options.map(
      (o) => `<button type="button" data-value="${o.value}"
					class="${o.value === current2 ? "active" : ""}">${o.label}</button>`
    ).join("");
    return `<div class="aurora-seg" data-field="${field}">
		<span class="aurora-seg-thumb"></span>${buttons}
	</div>`;
  }
  function swatches(current_hue) {
    return ACCENTS.map(
      (a) => `<button type="button" class="aurora-swatch ${Math.abs(a.hue - current_hue) < 4 ? "active" : ""}" style="--sw-h: ${a.hue}" data-hue="${a.hue}"
			title="${a.label}" aria-label="${a.label}"></button>`
    ).join("");
  }
  function switch_row(field, label, hint, on) {
    return `<div class="aurora-switch-row">
		<span class="aurora-switch-text">
			${label}
			${hint ? `<small>${hint}</small>` : ""}
		</span>
		<button type="button" class="aurora-switch" data-field="${field}"
			role="switch" aria-checked="${on}" aria-label="${label}"></button>
	</div>`;
  }
  function look_tab() {
    const s = get();
    return `
		<div class="aurora-field">
			<label>Colour mode</label>
			${segmented(
      "mode",
      [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "automatic", label: "Auto" }
      ],
      get_mode()
    )}
		</div>

		<div class="aurora-field">
			<label>Accent</label>
			<div class="aurora-swatches">${swatches(s.hue)}</div>
		</div>

		<div class="aurora-field">
			<label>Custom hue</label>
			<input type="range" class="aurora-hue" min="0" max="360" value="${s.hue}"
				aria-label="Accent hue">
		</div>

		<div class="aurora-field">
			<label>Typeface</label>
			${segmented(
      "font",
      [
        { value: "system", label: "System" },
        { value: "inter", label: "Inter" },
        { value: "rounded", label: "Rounded" },
        { value: "custom", label: "Custom" }
      ],
      s.font
    )}
			<div class="aurora-font-custom ${s.font === "custom" ? "" : "hidden"}">
				<div class="aurora-font-input-row">
					<input type="text" class="aurora-font-input" list="aurora-font-list"
						placeholder="Type a font name\u2026" autocomplete="off"
						spellcheck="false" value="${(s.font_custom || "").replace(/"/g, "&quot;")}">
					${can_enumerate() ? `<button type="button" class="aurora-font-browse"
									title="List fonts installed on this device">Browse</button>` : ""}
				</div>
				<datalist id="aurora-font-list"></datalist>
				<p class="aurora-font-status" data-state="idle"></p>
			</div>
		</div>

		<div class="aurora-field">
			<label>Corners</label>
			${segmented(
      "shape",
      [
        { value: "sharp", label: "Sharp" },
        { value: "soft", label: "Soft" },
        { value: "round", label: "Round" }
      ],
      s.shape
    )}
		</div>

		<div class="aurora-field">
			<label>Density</label>
			${segmented(
      "density",
      [
        { value: "compact", label: "Compact" },
        { value: "cozy", label: "Cozy" },
        { value: "roomy", label: "Roomy" }
      ],
      s.density
    )}
		</div>

		<div class="aurora-field">
			<label>Ambient colour</label>
			${segmented(
      "ambient",
      [
        { value: "off", label: "Off" },
        { value: "subtle", label: "Subtle" },
        { value: "vivid", label: "Vivid" }
      ],
      s.ambient
    )}
			<p class="aurora-note">Vivid tints the panels themselves, not just the background.</p>
		</div>

		<div class="aurora-field">
			<label>Toast position</label>
			${toast_picker(s.toast_position)}
			<p class="aurora-note">Where messages appear. Mobile always docks them to the bottom.</p>
		</div>`;
  }
  function toast_picker(current2) {
    const cells = TOAST_POSITIONS.map((pos) => {
      const [v, h] = pos.split("-");
      return `<button type="button" data-pos="${pos}"
			class="aurora-toast-cell${pos === current2 ? " active" : ""}"
			aria-label="${v} ${h}" title="${v} ${h}"><i></i></button>`;
    }).join("");
    return `<div class="aurora-toast-grid" data-field="toast_position">${cells}</div>`;
  }
  function motion_tab() {
    const s = get();
    const all_off = s.motion !== "on";
    return `
		${switch_row(
      "motion",
      "Animations",
      "Master switch for all motion",
      s.motion === "on"
    )}

		<div class="aurora-feature-list ${all_off ? "is-disabled" : ""}">
			<label>Individual effects</label>
			${FEATURES.map(
      (f) => switch_row(`feature:${f.key}`, f.label, f.hint, s.features[f.key] !== false)
    ).join("")}
		</div>

		<p class="aurora-note">
			Turning animations off here also respects your system's
			\u201Creduce motion\u201D setting automatically.
		</p>`;
  }
  function panel_html() {
    var _a, _b, _c;
    return `
		<div class="aurora-panel-head">
			<div>
				<div class="aurora-panel-title">Appearance</div>
				<div class="aurora-panel-sub">Saved to your account \u2014 only you see these.</div>
			</div>
		</div>

		<div class="aurora-tabs" role="tablist">
			<button type="button" data-tab="look" class="${tab === "look" ? "active" : ""}"
				role="tab">Look</button>
			<button type="button" data-tab="motion" class="${tab === "motion" ? "active" : ""}"
				role="tab">Motion</button>
			<span class="aurora-tabs-thumb"></span>
		</div>

		<div class="aurora-panel-body">
			${tab === "look" ? look_tab() : motion_tab()}
		</div>

		<div class="aurora-panel-footer">
			<button type="button" class="aurora-link-btn" data-action="reset">Reset to defaults</button>
			<span class="aurora-kbd">${((_c = (_b = (_a = window.frappe) == null ? void 0 : _a.utils) == null ? void 0 : _b.is_mac) == null ? void 0 : _c.call(_b)) ? "\u2318" : "Ctrl"}+\u21E7+K</span>
		</div>`;
  }
  function place_thumbs(scope) {
    scope.querySelectorAll(".aurora-seg, .aurora-tabs").forEach((group) => {
      const thumb = group.querySelector(".aurora-seg-thumb, .aurora-tabs-thumb");
      const active = group.querySelector("button.active");
      if (!thumb || !active)
        return;
      thumb.style.width = `${active.offsetWidth}px`;
      thumb.style.transform = `translateX(${active.offsetLeft - 3}px)`;
    });
  }
  function bind_panel() {
    const root = $panel;
    root.addEventListener("click", (e) => {
      var _a, _b, _c, _d, _e, _f;
      const tab_btn = e.target.closest(".aurora-tabs button");
      if (tab_btn) {
        tab = tab_btn.dataset.tab;
        refresh();
        return;
      }
      const cell = e.target.closest(".aurora-toast-cell");
      if (cell) {
        const pos = cell.dataset.pos;
        (_a = cell.closest(".aurora-toast-grid")) == null ? void 0 : _a.querySelectorAll(".aurora-toast-cell").forEach((c) => c.classList.toggle("active", c === cell));
        set({ toast_position: pos });
        (_b = frappe.show_alert) == null ? void 0 : _b.call(frappe, { message: `Toasts: ${pos.replace("-", " ")}`, indicator: "blue" });
        return;
      }
      const seg_btn = e.target.closest(".aurora-seg button");
      if (seg_btn) {
        const seg = seg_btn.closest(".aurora-seg");
        const field = seg.dataset.field;
        const value = seg_btn.dataset.value;
        seg.querySelectorAll("button").forEach(
          (b) => b.classList.toggle("active", b === seg_btn)
        );
        place_thumbs(root);
        field === "mode" ? set_mode(value) : set({ [field]: value });
        if (field === "font") {
          const row = root.querySelector(".aurora-font-custom");
          row == null ? void 0 : row.classList.toggle("hidden", value !== "custom");
          if (value === "custom") {
            fill_font_suggestions();
            (_c = root.querySelector(".aurora-font-input")) == null ? void 0 : _c.focus();
          }
        }
        return;
      }
      const swatch = e.target.closest(".aurora-swatch");
      if (swatch) {
        const hue = Number(swatch.dataset.hue);
        set({ hue });
        root.querySelectorAll(".aurora-swatch").forEach(
          (s) => s.classList.toggle("active", Number(s.dataset.hue) === hue)
        );
        const slider = root.querySelector(".aurora-hue");
        if (slider)
          slider.value = String(hue);
        return;
      }
      const sw = e.target.closest(".aurora-switch");
      if (sw) {
        const on = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", String(on));
        const field = sw.dataset.field;
        if (field.startsWith("feature:")) {
          set_feature(field.slice(8), on);
        } else if (field === "motion") {
          set({ motion: on ? "on" : "off" });
          (_d = root.querySelector(".aurora-feature-list")) == null ? void 0 : _d.classList.toggle("is-disabled", !on);
        } else {
          set({ [field]: on });
        }
        return;
      }
      if (e.target.closest(".aurora-font-browse")) {
        set_font_status("checking", "Reading installed fonts\u2026");
        list_installed().then((list2) => {
          var _a2;
          if (!list2.length) {
            set_font_status("missing", "Permission denied, or no fonts returned.");
            return;
          }
          fill_font_suggestions(list2);
          set_font_status("ok", `${list2.length} fonts available \u2014 start typing to filter.`);
          (_a2 = root.querySelector(".aurora-font-input")) == null ? void 0 : _a2.focus();
        });
        return;
      }
      if (e.target.closest('[data-action="reset"]')) {
        reset();
        refresh();
        (_f = (_e = window.frappe) == null ? void 0 : _e.show_alert) == null ? void 0 : _f.call(_e, { message: "Theme reset", indicator: "blue" }, 3);
      }
    });
    let font_timer = null;
    root.addEventListener("input", (e) => {
      if (!e.target.classList.contains("aurora-font-input"))
        return;
      const value = e.target.value;
      clearTimeout(font_timer);
      font_timer = setTimeout(() => try_custom_font(value), 420);
    });
    root.addEventListener("keydown", (e) => {
      if (!e.target.classList.contains("aurora-font-input"))
        return;
      if (e.key !== "Enter")
        return;
      e.preventDefault();
      clearTimeout(font_timer);
      try_custom_font(e.target.value);
    });
    root.addEventListener("input", (e) => {
      if (!e.target.classList.contains("aurora-hue"))
        return;
      const hue = Number(e.target.value);
      set({ hue });
      root.querySelectorAll(".aurora-swatch").forEach(
        (s) => s.classList.toggle("active", Math.abs(Number(s.dataset.hue) - hue) < 4)
      );
    });
  }
  function fill_font_suggestions(extra = []) {
    const list2 = $panel.querySelector("#aurora-font-list");
    if (!list2)
      return;
    const { local, google } = suggestions();
    const all = [.../* @__PURE__ */ new Set([...extra, ...local, ...google])];
    list2.innerHTML = all.map((f) => `<option value="${f}"></option>`).join("");
  }
  function set_font_status(state2, text) {
    const el2 = $panel.querySelector(".aurora-font-status");
    if (!el2)
      return;
    el2.dataset.state = state2;
    el2.textContent = text;
  }
  async function try_custom_font(family) {
    const name = (family || "").trim();
    if (!name) {
      set_font_status("idle", "");
      set({ font_custom: "" });
      return;
    }
    set_font_status("checking", `Looking for \u201C${name}\u201D\u2026`);
    const where = await resolve(name);
    if (where === "missing") {
      set_font_status("missing", `\u201C${name}\u201D isn't installed and isn't on Google Fonts.`);
      return;
    }
    set({ font: "custom", font_custom: name });
    set_font_status(
      "ok",
      where === "local" ? `Using \u201C${name}\u201D from this device.` : `Loaded \u201C${name}\u201D from Google Fonts.`
    );
  }
  function refresh() {
    $panel.innerHTML = panel_html();
    fill_font_suggestions();
    const s = get();
    if (s.font === "custom" && s.font_custom) {
      set_font_status("ok", `Using \u201C${s.font_custom}\u201D.`);
    }
    requestAnimationFrame(() => place_thumbs($panel));
  }
  function toggle_panel(force) {
    var _a;
    if (!$panel)
      return;
    open2 = force === void 0 ? !open2 : force;
    $panel.classList.toggle("open", open2);
    $dock.classList.toggle("is-awake", open2);
    (_a = $dock.querySelector('[data-action="appearance"]')) == null ? void 0 : _a.classList.toggle("is-open", open2);
    if (open2) {
      refresh();
      requestAnimationFrame(() => place_thumbs($panel));
    }
  }
  function toggle_mode() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    set_mode(dark ? "light" : "dark");
    if (open2)
      refresh();
  }
  function init13() {
    $dock = document.createElement("div");
    $dock.className = "aurora-dock";
    $dock.innerHTML = `
		<button type="button" class="aurora-dock-btn" data-action="palette"
			aria-label="Quick actions">
			${icon("command")}<span class="aurora-dock-label">Quick actions</span>
		</button>
		<button type="button" class="aurora-dock-btn" data-action="mode"
			aria-label="Toggle colour mode">
			${icon("sun")}<span class="aurora-dock-label">Light / dark</span>
		</button>
		<button type="button" class="aurora-dock-btn" data-action="charts"
			aria-label="Toggle chart theming" aria-pressed="false">
			${icon("chart")}<span class="aurora-dock-label">Chart theming</span>
		</button>
		<button type="button" class="aurora-dock-btn" data-action="appearance"
			aria-label="Appearance settings">
			${icon("sparkles")}<span class="aurora-dock-label">Appearance</span>
		</button>`;
    $panel = document.createElement("div");
    $panel.className = "aurora-panel";
    $panel.setAttribute("role", "dialog");
    $panel.setAttribute("aria-label", "Appearance settings");
    document.body.appendChild($dock);
    document.body.appendChild($panel);
    refresh();
    bind_panel();
    sync_mode_icon();
    $dock.addEventListener("click", (e) => {
      const btn = e.target.closest(".aurora-dock-btn");
      if (!btn)
        return;
      const action = btn.dataset.action;
      if (action === "appearance")
        toggle_panel();
      if (action === "mode")
        toggle_mode();
      if (action === "palette")
        open();
      if (action === "charts")
        toggle_charts();
    });
    document.addEventListener("pointerdown", (e) => {
      if (!open2)
        return;
      if ($panel.contains(e.target) || $dock.contains(e.target))
        return;
      toggle_panel(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open2)
        toggle_panel(false);
    });
    document.addEventListener("aurora:mode", sync_mode_icon);
    document.addEventListener("aurora:open-panel", () => toggle_panel(true));
    document.addEventListener("aurora:settings", sync_dock);
    sync_dock();
  }
  function toggle_charts() {
    var _a, _b, _c, _d;
    const on = !feature("charts");
    set_feature("charts", on);
    sync_dock();
    try {
      ((_a = frappe.dashboard_utils) == null ? void 0 : _a.render_chart_filters) && document.dispatchEvent(new CustomEvent("aurora:charts", { detail: { on } }));
      if ((_c = (_b = frappe.views) == null ? void 0 : _b.workspace_view) == null ? void 0 : _c.refresh)
        frappe.views.workspace_view.refresh();
    } catch (e) {
    }
    (_d = frappe.show_alert) == null ? void 0 : _d.call(frappe, {
      message: on ? "Chart theming on" : "Chart theming off \u2014 reload to repaint",
      indicator: on ? "green" : "gray"
    });
  }
  function sync_dock() {
    const palette_btn = $dock == null ? void 0 : $dock.querySelector('[data-action="palette"]');
    if (palette_btn)
      palette_btn.hidden = !feature("palette");
    const charts_btn = $dock == null ? void 0 : $dock.querySelector('[data-action="charts"]');
    if (charts_btn) {
      const on = feature("charts");
      charts_btn.classList.toggle("is-active", on);
      charts_btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }
  function sync_mode_icon() {
    const btn = $dock == null ? void 0 : $dock.querySelector('[data-action="mode"]');
    if (!btn)
      return;
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = `${icon(dark ? "sun" : "moon")}
		<span class="aurora-dock-label">${dark ? "Light mode" : "Dark mode"}</span>`;
  }

  // ../aurora/aurora/public/js/theme/form_feedback.js
  var form_feedback_exports = {};
  __export(form_feedback_exports, {
    init: () => init14
  });
  var DIRTY = ["not saved", "not amended"];
  function watch(pill) {
    if (pill.dataset.auroraWatched)
      return;
    pill.dataset.auroraWatched = "1";
    let was_dirty = DIRTY.includes(pill.textContent.trim().toLowerCase());
    new MutationObserver(() => {
      const text = pill.textContent.trim().toLowerCase();
      const dirty = DIRTY.includes(text);
      if (was_dirty && !dirty && !motion_off()) {
        pill.classList.remove("aurora-saved");
        void pill.offsetWidth;
        pill.classList.add("aurora-saved");
      }
      was_dirty = dirty;
    }).observe(pill, { childList: true, characterData: true, subtree: true });
  }
  function scan2() {
    document.querySelectorAll(".page-indicator-pill").forEach(watch);
  }
  function init14() {
    new MutationObserver(scan2).observe(document.body, { childList: true, subtree: true });
    $(document).on("page-change", scan2);
    scan2();
  }

  // ../aurora/aurora/public/js/theme/desktop.js
  var desktop_exports = {};
  __export(desktop_exports, {
    init: () => init15
  });
  var GRID = ".desktop-wrapper .icons";
  var animate_icons = debounce(() => {
    if (motion_off() || !feature("reveal"))
      return;
    document.querySelectorAll(GRID).forEach((grid) => {
      if (grid.closest(".folder-icon"))
        return;
      const icons = Array.from(grid.children).filter(
        (n) => n.classList.contains("desktop-icon")
      );
      if (!icons.length)
        return;
      icons.forEach((el2, i) => {
        if (el2.dataset.auroraIn)
          return;
        el2.dataset.auroraIn = "1";
        el2.style.setProperty("--aurora-i", String(Math.min(i, 24)));
        el2.classList.add("aurora-desk-in");
        el2.addEventListener(
          "animationend",
          () => el2.classList.remove("aurora-desk-in"),
          { once: true }
        );
      });
    });
  }, 40);
  var condense = raf_throttle(() => {
    var _a;
    if (!feature("condensed_header"))
      return;
    const bar2 = document.querySelector(".desktop-wrapper .navbar-container");
    if (!bar2)
      return;
    const scroller2 = (_a = document.querySelector(".desktop-wrapper")) == null ? void 0 : _a.closest(".page-container");
    const offset = Math.max(window.scrollY || 0, (scroller2 == null ? void 0 : scroller2.scrollTop) || 0);
    bar2.classList.toggle("aurora-condensed", offset > 12);
  });
  function init15() {
    new MutationObserver(() => {
      if (!document.querySelector(".desktop-wrapper"))
        return;
      animate_icons();
    }).observe(document.body, { childList: true, subtree: true });
    $(document).on("page-change", () => {
      animate_icons();
      condense();
    });
    window.addEventListener("scroll", condense, { passive: true });
    document.addEventListener("scroll", condense, { passive: true, capture: true });
    animate_icons();
  }

  // ../aurora/aurora/public/js/theme/charts.js
  var charts_exports = {};
  __export(charts_exports, {
    init: () => init16,
    palette: () => palette,
    ramp: () => ramp
  });
  function hsl_to_hex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
    return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
  }
  function accent_hue() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--aurora-h").trim();
    const h = parseFloat(raw);
    return isFinite(h) ? h : 256;
  }
  function palette(count = 9) {
    const base = accent_hue();
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const out = [];
    for (let i = 0; i < count; i++) {
      const h = (base + i * 137.508) % 360;
      const s = i === 0 ? 78 : 66 - i % 3 * 5;
      const l = (dark ? 62 : 55) + (i % 2 ? 8 : 0);
      out.push(hsl_to_hex(h, s, l));
    }
    return out;
  }
  function ramp(steps = 5) {
    const base = accent_hue();
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return Array.from({ length: steps }, (_, i) => {
      const t = i / Math.max(1, steps - 1);
      const l = dark ? 18 + t * 46 : 94 - t * 46;
      const s = 30 + t * 48;
      return hsl_to_hex(base, s, l);
    });
  }
  function has_explicit_colors(options) {
    const c = options == null ? void 0 : options.colors;
    if (!Array.isArray(c))
      return false;
    return c.some((x) => typeof x === "string" && x.trim() !== "");
  }
  var BAR_RADIUS = 5;
  function round_bars(root) {
    root.querySelectorAll("rect.bar").forEach((rect) => {
      const w = parseFloat(rect.getAttribute("width")) || 0;
      const r = Math.max(0, Math.min(BAR_RADIUS, w / 2));
      if (rect.getAttribute("rx") === String(r))
        return;
      rect.setAttribute("rx", r);
      rect.setAttribute("ry", r);
    });
  }
  function watch_bars(container) {
    if (!container || container.dataset.auroraBars)
      return;
    container.dataset.auroraBars = "1";
    round_bars(container);
    try {
      new MutationObserver(() => round_bars(container)).observe(container, {
        childList: true,
        subtree: true
      });
    } catch (e) {
    }
  }
  function shape_options(options) {
    const out = {};
    if (options.type === "line") {
      out.lineOptions = __spreadValues({
        spline: 1,
        regionFill: 1,
        hideDots: 0,
        dotSize: 4
      }, options.lineOptions || {});
    }
    if (options.type === "bar") {
      out.barOptions = __spreadValues({ spaceRatio: 0.4 }, options.barOptions || {});
    }
    if (options.type === "percentage") {
      out.barOptions = __spreadValues({ height: 14, depth: 2 }, options.barOptions || {});
    }
    return out;
  }
  function repaint(container) {
    var _a;
    const colors = palette();
    container.querySelectorAll("g[class*='dataset-']").forEach((group) => {
      const found = /\bdataset-(\d+)\b/.exec(group.getAttribute("class") || "");
      if (!found)
        return;
      const color = colors[Number(found[1]) % colors.length];
      group.querySelectorAll("rect.bar").forEach((r) => r.style.fill = color);
      group.querySelectorAll("circle").forEach((c) => c.style.fill = color);
      group.querySelectorAll("path").forEach((p) => {
        if (p.classList.contains("dataset-path"))
          p.style.stroke = color;
        else
          p.style.fill = color;
      });
    });
    (_a = container.parentElement) == null ? void 0 : _a.querySelectorAll(".legend-dot, .tooltip-legend").forEach((dot, i) => dot.style.background = colors[i % colors.length]);
    round_bars(container);
  }
  function repaint_all() {
    if (!feature("charts"))
      return;
    document.querySelectorAll(".chart-container").forEach((c) => {
      try {
        repaint(c);
      } catch (e) {
      }
    });
  }
  function init16() {
    var _a, _b;
    document.addEventListener("aurora:settings", repaint_all);
    document.addEventListener("aurora:mode", repaint_all);
    if (!((_a = window.frappe) == null ? void 0 : _a.Chart) || frappe.Chart.__aurora)
      return;
    const Original = frappe.Chart;
    class AuroraChart extends Original {
      constructor(parent, options = {}) {
        var _a2, _b2;
        try {
          if (feature("charts")) {
            options = __spreadValues(__spreadValues(__spreadValues({}, options), shape_options(options)), has_explicit_colors(options) ? {} : { colors: options.type === "heatmap" ? ramp(5) : palette() });
          }
        } catch (e) {
          console.error("[aurora] chart palette failed", e);
        }
        super(parent, options);
        try {
          if (feature("charts")) {
            const el2 = typeof parent === "string" ? document.querySelector(parent) : parent;
            const box = this.container || ((_a2 = el2 == null ? void 0 : el2.querySelector) == null ? void 0 : _a2.call(el2, ".chart-container")) || el2;
            (_b2 = box == null ? void 0 : box.classList) == null ? void 0 : _b2.add("aurora-chart");
            if (box)
              watch_bars(box);
          }
        } catch (e) {
        }
      }
    }
    AuroraChart.__aurora = true;
    frappe.Chart = AuroraChart;
    if (((_b = frappe.ui) == null ? void 0 : _b.RealtimeChart) && !frappe.ui.RealtimeChart.__aurora) {
      const Realtime = frappe.ui.RealtimeChart;
      class AuroraRealtimeChart extends Realtime {
        constructor(element, socketEvent, maxLabelPoints, data = {}) {
          if (feature("charts") && !has_explicit_colors(data)) {
            data = __spreadProps(__spreadValues({}, data), { colors: palette() });
          }
          super(element, socketEvent, maxLabelPoints, data);
        }
      }
      AuroraRealtimeChart.__aurora = true;
      frappe.ui.RealtimeChart = AuroraRealtimeChart;
    }
  }

  // ../aurora/aurora/public/js/theme/quicklook.js
  var quicklook_exports = {};
  __export(quicklook_exports, {
    init: () => init17
  });
  var HOVER_DELAY = 420;
  var IMAGE_RE = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(\?|#|$)/i;
  var PDF_RE = /\.pdf(\?|#|$)/i;
  var SHEET_RE = /\.(xlsx|xlsm|xls|csv)(\?|#|$)/i;
  var FRAME_CSS = `
	.body-sidebar-container, .navbar, .sticky-top, .layout-footer,
	.aurora-dock, .aurora-panel, .aurora-palette, .aurora-entry,
	.page-head .sidebar-toggle-btn { display: none !important; }
	.main-section, #body { margin-left: 0 !important; padding-left: 0 !important;
		width: 100% !important; max-width: none !important; }
	body { overflow-x: hidden !important; }
`;
  var peek = null;
  var panel = null;
  var backdrop = null;
  var hover_timer = null;
  var current = null;
  var expanded = null;
  var panel_open = false;
  var FILE_PATH_RE = /\/(?:private\/)?files\//;
  function file_url_of(raw) {
    if (!raw || raw.startsWith("data:"))
      return null;
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin !== window.location.origin)
        return null;
      const path = url.pathname + url.search;
      return FILE_PATH_RE.test(path) ? path : null;
    } catch (e) {
      return null;
    }
  }
  function image_src_of(raw) {
    if (!raw)
      return null;
    const value = raw.trim();
    if (!value || value.startsWith("blob:"))
      return null;
    if (value.startsWith("data:image/"))
      return value;
    try {
      const url = new URL(value, window.location.origin);
      return /^https?:$/.test(url.protocol) ? url.href : null;
    } catch (e) {
      return null;
    }
  }
  function is_external(url) {
    try {
      return new URL(url, window.location.origin).origin !== window.location.origin;
    } catch (e) {
      return false;
    }
  }
  function file_kind(url) {
    if (IMAGE_RE.test(url))
      return "image";
    if (PDF_RE.test(url))
      return "pdf";
    if (SHEET_RE.test(url))
      return "sheet";
    return "file";
  }
  function describe(el2) {
    if (!el2 || !el2.closest)
      return null;
    const doc_link = el2.closest("a[data-doctype][data-name]");
    if (doc_link) {
      return {
        kind: "doc",
        doctype: doc_link.dataset.doctype,
        name: frappe.utils.unescape_html(doc_link.dataset.name)
      };
    }
    const link_input = el2.closest('input[data-fieldtype="Link"][data-target]');
    if (link_input && link_input.value) {
      return { kind: "doc", doctype: link_input.dataset.target, name: link_input.value };
    }
    const host = el2.closest(
      ".sidebar-image, .sidebar-image-wrapper, .image-view-item, .file-preview"
    );
    if (host) {
      const img = host.matches("img") ? host : host.querySelector("img");
      const url = img && image_src_of(img.getAttribute("src"));
      if (url)
        return { kind: "image", url };
    }
    const link = el2.closest("a[href]");
    if (link) {
      const url = file_url_of(link.getAttribute("href"));
      if (url)
        return { kind: file_kind(url), url };
    }
    const pill = el2.closest(".attachment-row, .attached-file");
    if (pill) {
      const a = pill.querySelector('a[href*="/files/"]');
      const url = a && file_url_of(a.getAttribute("href"));
      if (url)
        return { kind: file_kind(url), url };
    }
    return null;
  }
  function same_target(a, b) {
    if (!a || !b)
      return false;
    return a.kind === b.kind && a.url === b.url && a.doctype === b.doctype && a.name === b.name;
  }
  function basename(url) {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  }
  function ext_of(name) {
    const ext = (name.split(".").pop() || "").replace(/[^a-z0-9]/gi, "");
    return (ext || "file").slice(0, 5).toUpperCase();
  }
  function ensure_peek() {
    if (peek)
      return;
    peek = document.createElement("div");
    peek.className = "aurora-ql-peek";
    document.body.appendChild(peek);
    peek.addEventListener("click", () => current && expand(current));
    peek.addEventListener("mouseenter", () => clearTimeout(hover_timer));
    peek.addEventListener("mouseleave", hide_peek);
  }
  function place_peek(x, y) {
    const pad = 14;
    const rect = peek.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;
    if (left + rect.width > window.innerWidth - 8)
      left = x - rect.width - pad;
    if (top + rect.height > window.innerHeight - 8)
      top = y - rect.height - pad;
    peek.style.left = `${Math.max(8, left)}px`;
    peek.style.top = `${Math.max(8, top)}px`;
  }
  function shell(body, hint = "Space to open") {
    return `${body}<div class="aurora-ql-hint"><kbd>space</kbd><span>${hint}</span></div>`;
  }
  function show_peek(target, x, y) {
    var _a;
    ensure_peek();
    current = target;
    peek.classList.add("open");
    peek.dataset.kind = target.kind;
    if (target.kind === "image") {
      peek.innerHTML = shell(`<img class="aurora-ql-thumb" src="${target.url}" alt="">`);
      place_peek(x, y);
      (_a = peek.querySelector("img")) == null ? void 0 : _a.addEventListener("load", () => place_peek(x, y), { once: true });
      return;
    }
    if (target.kind === "pdf" || target.kind === "file" || target.kind === "sheet") {
      const name = basename(target.url);
      peek.innerHTML = shell(
        `<div class="aurora-ql-file">
				<span class="aurora-ql-file-ext">${ext_of(name)}</span>
				<span class="aurora-ql-file-name">${frappe.utils.escape_html(name)}</span>
			</div>`
      );
      place_peek(x, y);
      return;
    }
    peek.innerHTML = shell(
      `<div class="aurora-ql-doc">
			<div class="aurora-ql-doc-head"><div>
				<span class="aurora-ql-dt">${frappe.utils.escape_html(target.doctype)}</span>
				<span class="aurora-ql-name">${frappe.utils.escape_html(target.name)}</span>
			</div></div>
			<div class="aurora-ql-skeleton"><i></i><i></i><i></i></div>
		</div>`
    );
    place_peek(x, y);
    frappe.xcall("aurora.api.preview_doc", { doctype: target.doctype, name: target.name }).then((data) => {
      if (!same_target(current, target) || !peek.classList.contains("open"))
        return;
      if (!data || !data.name)
        return;
      peek.innerHTML = shell(render_doc(data), "Space to open & edit");
      place_peek(x, y);
    }).catch(() => {
      if (!same_target(current, target))
        return;
      peek.innerHTML = shell(
        `<div class="aurora-ql-doc"><div class="aurora-ql-empty">No preview available</div></div>`
      );
    });
  }
  function render_doc(d) {
    const status = d.status || (d.docstatus === 1 ? "Submitted" : d.docstatus === 2 ? "Cancelled" : d.docstatus === 0 ? "Draft" : "");
    const rows = (d.fields || []).map(
      (f) => `<div class="aurora-ql-row"><span>${frappe.utils.escape_html(
        f.label
      )}</span><b>${frappe.utils.escape_html(String(f.value))}</b></div>`
    ).join("");
    return `<div class="aurora-ql-doc">
		<div class="aurora-ql-doc-head">
			${d.image ? `<img class="aurora-ql-avatar" src="${d.image}" alt="">` : ""}
			<div>
				<span class="aurora-ql-dt">${frappe.utils.escape_html(d.doctype)}</span>
				<span class="aurora-ql-name">${frappe.utils.escape_html(d.title || d.name)}</span>
			</div>
			${status ? `<span class="aurora-ql-status">${frappe.utils.escape_html(status)}</span>` : ""}
		</div>
		${rows ? `<div class="aurora-ql-rows">${rows}</div>` : ""}
	</div>`;
  }
  function hide_peek() {
    clearTimeout(hover_timer);
    current = null;
    peek == null ? void 0 : peek.classList.remove("open");
  }
  function ensure_panel() {
    if (panel)
      return;
    backdrop = document.createElement("div");
    backdrop.className = "aurora-ql-backdrop";
    backdrop.addEventListener("click", close_panel);
    panel = document.createElement("div");
    panel.className = "aurora-ql-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Quick Look");
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
  }
  function doc_route(target) {
    return `/app/${frappe.router.slug(target.doctype)}/${encodeURIComponent(target.name)}`;
  }
  function expand(target) {
    var _a;
    ensure_panel();
    hide_peek();
    panel_open = true;
    expanded = target;
    const title = target.kind === "doc" ? `${target.doctype} \xB7 ${target.name}` : basename(target.url);
    const open_href = target.kind === "doc" ? doc_route(target) : target.url;
    panel.innerHTML = `
		<div class="aurora-ql-panel-head">
			<div class="aurora-ql-panel-title" title="${frappe.utils.escape_html(title)}">
				${frappe.utils.escape_html(title)}
			</div>
			<div class="aurora-ql-panel-actions">
				<a class="aurora-ql-btn" href="${open_href}" ${target.kind === "doc" ? "" : 'target="_blank" rel="noopener"'}>Open</a>
				${target.kind !== "doc" && !is_external(target.url) ? `<a class="aurora-ql-btn" href="${target.url}" download>Download</a>` : ""}
				<button type="button" class="aurora-ql-close" aria-label="Close">${icon("close", 15)}</button>
			</div>
		</div>
		<div class="aurora-ql-panel-body">${panel_body(target)}</div>`;
    panel.querySelector(".aurora-ql-close").addEventListener("click", close_panel);
    if (target.kind === "doc") {
      (_a = panel.querySelector('a.aurora-ql-btn[href^="/app/"]')) == null ? void 0 : _a.addEventListener("click", (e) => {
        e.preventDefault();
        close_panel();
        frappe.set_route("Form", target.doctype, target.name);
      });
      const frame = panel.querySelector("iframe");
      frame == null ? void 0 : frame.addEventListener(
        "load",
        () => {
          var _a2;
          (_a2 = panel.querySelector(".aurora-ql-loading")) == null ? void 0 : _a2.remove();
          strip_frame_chrome(frame);
        },
        { once: true }
      );
    }
    if (target.kind === "sheet")
      load_sheet(target);
    requestAnimationFrame(() => {
      backdrop.classList.add("open");
      panel.classList.add("open");
    });
  }
  function panel_body(target) {
    if (target.kind === "image") {
      return `<div class="aurora-ql-stage"><img src="${target.url}" alt=""></div>`;
    }
    if (target.kind === "pdf") {
      return `<iframe class="aurora-ql-frame" src="${target.url}#view=FitH" title="PDF preview"></iframe>`;
    }
    if (target.kind === "sheet") {
      return `<div class="aurora-ql-sheet"><div class="aurora-ql-loading"><i></i><i></i><i></i></div></div>`;
    }
    if (target.kind === "doc") {
      return `<div class="aurora-ql-loading"><i></i><i></i><i></i></div>
			<iframe class="aurora-ql-frame" src="${doc_route(target)}" title="Document preview"></iframe>`;
    }
    const name = basename(target.url);
    return `<div class="aurora-ql-stage aurora-ql-stage-empty">
		<div class="aurora-ql-file-ext big">${ext_of(name)}</div>
		<p>${frappe.utils.escape_html(name)}</p>
		<p class="aurora-ql-muted">This file type can't be previewed in the browser.</p>
	</div>`;
  }
  function load_sheet(target, sheet_name) {
    const host = panel.querySelector(".aurora-ql-sheet");
    if (!host)
      return;
    frappe.xcall("aurora.api.preview_sheet", { file_url: target.url, sheet: sheet_name || null }).then((data) => {
      if (!panel_open || !same_target(expanded, target))
        return;
      host.innerHTML = render_sheet(data);
      bind_sheet_tabs(target);
    }).catch(() => {
      if (!panel_open || !same_target(expanded, target))
        return;
      host.innerHTML = `<div class="aurora-ql-sheet-msg">This spreadsheet could not be read.</div>`;
    });
  }
  function render_sheet(data) {
    if (!data || data.unsupported) {
      return `<div class="aurora-ql-sheet-msg">
			<p>This spreadsheet format can't be previewed.</p>
			<p class="aurora-ql-muted">Only .xlsx, .xlsm and .csv can be read \u2014 the old .xls
			format cannot. Use Download to open it locally.</p>
		</div>`;
    }
    if (data.too_large) {
      return `<div class="aurora-ql-sheet-msg">
			<p>This spreadsheet is too large to preview.</p>
			<p class="aurora-ql-muted">Use Download to open it locally.</p>
		</div>`;
    }
    const rows = data.rows || [];
    if (!rows.length)
      return `<div class="aurora-ql-sheet-msg">This sheet is empty.</div>`;
    const esc = (v) => frappe.utils.escape_html(String(v != null ? v : ""));
    const [head, ...body] = rows;
    const tabs = (data.sheets || []).length > 1 ? `<div class="aurora-ql-sheet-tabs">${data.sheets.map(
      (s) => `<button type="button" class="aurora-ql-sheet-tab${s === data.sheet ? " active" : ""}" data-sheet="${esc(s)}">${esc(s)}</button>`
    ).join("")}</div>` : "";
    const table = `<table class="aurora-ql-sheet-table">
		<thead><tr>${head.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
		<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
	</table>`;
    const note = data.truncated ? `<div class="aurora-ql-sheet-note">Showing the first ${rows.length} of
			${esc(data.total_rows)} rows. Download the file to see all of it.</div>` : "";
    return `${tabs}<div class="aurora-ql-sheet-scroll">${table}</div>${note}`;
  }
  function bind_sheet_tabs(target) {
    panel.querySelectorAll(".aurora-ql-sheet-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const host = panel.querySelector(".aurora-ql-sheet");
        if (host)
          host.innerHTML = `<div class="aurora-ql-loading"><i></i><i></i><i></i></div>`;
        load_sheet(target, btn.dataset.sheet);
      });
    });
  }
  function strip_frame_chrome(frame) {
    try {
      const doc = frame.contentDocument;
      if (!(doc == null ? void 0 : doc.head))
        return;
      const style = doc.createElement("style");
      style.textContent = FRAME_CSS;
      doc.head.appendChild(style);
    } catch (e) {
    }
  }
  function close_panel() {
    if (!panel_open)
      return;
    panel_open = false;
    expanded = null;
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    const clear = () => {
      if (!panel_open)
        panel.innerHTML = "";
    };
    motion_off() ? clear() : setTimeout(clear, 280);
  }
  function suppress_core_previews() {
    var _a, _b, _c, _d, _e;
    const LinkPreview = (_b = (_a = window.frappe) == null ? void 0 : _a.ui) == null ? void 0 : _b.LinkPreview;
    if ((LinkPreview == null ? void 0 : LinkPreview.prototype) && !LinkPreview.prototype.aurora_suppressed) {
      LinkPreview.prototype.aurora_suppressed = true;
      LinkPreview.prototype.setup_popover_control = function() {
      };
    }
    const AttachImage = (_e = (_d = (_c = window.frappe) == null ? void 0 : _c.ui) == null ? void 0 : _d.form) == null ? void 0 : _e.ControlAttachImage;
    if ((AttachImage == null ? void 0 : AttachImage.prototype) && !AttachImage.prototype.aurora_suppressed) {
      AttachImage.prototype.aurora_suppressed = true;
      const make_input = AttachImage.prototype.make_input;
      AttachImage.prototype.make_input = function(...args) {
        var _a2;
        const out = make_input.apply(this, args);
        try {
          (_a2 = this.$value) == null ? void 0 : _a2.find(".attached-file-link").popover("dispose");
        } catch (e) {
        }
        return out;
      };
    }
  }
  function init17() {
    suppress_core_previews();
    document.addEventListener(
      "pointerover",
      (e) => {
        if (!feature("quicklook") || panel_open)
          return;
        const target = describe(e.target);
        if (!target) {
          if (current && !(peek == null ? void 0 : peek.matches(":hover")))
            hide_peek();
          return;
        }
        if (same_target(current, target))
          return;
        clearTimeout(hover_timer);
        const { clientX, clientY } = e;
        hover_timer = setTimeout(() => show_peek(target, clientX, clientY), HOVER_DELAY);
      },
      { passive: true }
    );
    document.addEventListener(
      "pointerout",
      (e) => {
        if (!current)
          return;
        const to = e.relatedTarget;
        if (to && ((peek == null ? void 0 : peek.contains(to)) || describe(to)))
          return;
        clearTimeout(hover_timer);
        hide_peek();
      },
      { passive: true }
    );
    document.addEventListener("keydown", (e) => {
      var _a;
      if (e.key === "Escape" && panel_open) {
        e.preventDefault();
        close_panel();
        return;
      }
      if (e.code !== "Space" && e.key !== " ")
        return;
      if ((_a = document.activeElement) == null ? void 0 : _a.matches("input, textarea, select, [contenteditable=true]"))
        return;
      if (!current || panel_open)
        return;
      e.preventDefault();
      expand(current);
    });
    $(document).on("page-change", () => {
      hide_peek();
      close_panel();
    });
    $(document).on("show.bs.modal", () => {
      hide_peek();
      close_panel();
    });
  }

  // ../aurora/aurora/public/js/theme/entrance.js
  var entrance_exports = {};
  __export(entrance_exports, {
    init: () => init18
  });
  var FLAG = "aurora:signed-in";
  var MIN_HOLD = 420;
  var REVEAL = 900;
  var FAILSAFE = 4e3;
  var curtain = null;
  var mounted_at = 0;
  var failsafe_timer = null;
  function claim_flag() {
    try {
      if (window.sessionStorage.getItem(FLAG) !== "1")
        return false;
      window.sessionStorage.removeItem(FLAG);
      return true;
    } catch (e) {
      return false;
    }
  }
  function logo_src() {
    var _a, _b, _c;
    return ((_a = document.querySelector(".splash img")) == null ? void 0 : _a.getAttribute("src")) || ((_c = (_b = window.frappe) == null ? void 0 : _b.boot) == null ? void 0 : _c.app_logo_url) || "/assets/frappe/images/frappe-framework-logo.svg";
  }
  function teardown() {
    clearTimeout(failsafe_timer);
    curtain == null ? void 0 : curtain.remove();
    curtain = null;
    document.documentElement.classList.remove("aurora-entering", "aurora-entry-play");
  }
  function mount2() {
    if (!claim_flag())
      return;
    if (motion_off() || !feature("signin_entrance") || !document.body)
      return;
    curtain = document.createElement("div");
    curtain.className = "aurora-entry";
    curtain.setAttribute("aria-hidden", "true");
    Object.assign(curtain.style, {
      position: "fixed",
      inset: "0",
      display: "grid",
      placeItems: "center"
    });
    const mark = document.createElement("img");
    mark.className = "aurora-entry-mark";
    mark.alt = "";
    mark.setAttribute("src", logo_src());
    curtain.appendChild(mark);
    document.body.appendChild(curtain);
    document.documentElement.classList.add("aurora-entering");
    mounted_at = Date.now();
    failsafe_timer = setTimeout(teardown, FAILSAFE);
  }
  function init18() {
    if (!curtain)
      return;
    const wait = Math.max(0, MIN_HOLD - (Date.now() - mounted_at));
    setTimeout(() => {
      if (!curtain)
        return;
      curtain.classList.add("leaving");
      document.documentElement.classList.add("aurora-entry-play");
      setTimeout(teardown, REVEAL);
    }, wait);
  }
  mount2();

  // ../aurora/aurora/public/js/theme/index.js
  var MODULES = [
    ["entrance", entrance_exports, "signin_entrance"],
    ["backdrop", backdrop_exports, null],
    ["recents", recents_exports, null],
    ["dock", dock_exports, null],
    ["progress", progress_exports, "progress_bar"],
    ["transitions", transitions_exports, "page_transitions"],
    ["ripple", ripple_exports, "ripple"],
    ["reveal", reveal_exports, "reveal"],
    ["tilt", tilt_exports, "tilt"],
    ["counters", counters_exports, "counters"],
    ["page_head", page_head_exports, "condensed_header"],
    ["scroll_top", scroll_top_exports, "back_to_top"],
    ["toasts", toasts_exports, "toast_timers"],
    ["form_feedback", form_feedback_exports, "save_pulse"],
    ["palette", palette_exports, "palette"],
    ["desktop", desktop_exports, null],
    ["charts", charts_exports, null],
    ["quicklook", quicklook_exports, "quicklook"]
  ];
  var started = /* @__PURE__ */ new Set();
  function start2(name, mod) {
    if (started.has(name))
      return;
    started.add(name);
    try {
      mod.init();
    } catch (e) {
      console.error(`[aurora] ${name} failed to start`, e);
    }
  }
  function sync_modules() {
    MODULES.forEach(([name, mod, flag]) => {
      if (flag && !feature(flag))
        return;
      start2(name, mod);
    });
  }
  function boot() {
    sync_modules();
    try {
      hydrate_from_boot();
    } catch (e) {
      console.error("[aurora] could not read saved theme", e);
    }
    document.addEventListener("aurora:settings", sync_modules);
    document.documentElement.classList.add("aurora-ready");
  }
  window.aurora = {
    settings: settings_exports,
    palette: palette_exports,
    dock: dock_exports,
    version: "1.1.0"
  };
  $(document).ready(() => {
    var _a;
    if (document.body.classList.contains("no-desk") || !((_a = window.frappe) == null ? void 0 : _a.start_app)) {
      boot();
      return;
    }
    on_app_ready(boot);
  });
})();
//# sourceMappingURL=aurora.bundle.375RDXPC.js.map
