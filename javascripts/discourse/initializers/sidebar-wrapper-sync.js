// Sync the outer .sidebar-wrapper with the inner sidebar collapse state
// Ensures wrapper hides when the sidebar is collapsed so no layout width is reserved
import { withPluginApi } from "discourse/lib/plugin-api";

function isSidebarCollapsed() {
  try {
    const html = document.documentElement;
    const body = document.body;
    if (html.classList.contains("sidebar-collapsed") || body.classList.contains("sidebar-collapsed")) {
      return true;
    }

    // Try to detect the inner sidebar element and infer its visibility
    const inner = document.querySelector(
      ".sidebar-container, aside.sidebar, .sidebar, .sidebar-panel"
    );
    if (inner) {
      if (inner.classList.contains("is-collapsed") || inner.getAttribute("aria-hidden") === "true") {
        return true;
      }
      const cs = window.getComputedStyle(inner);
      const width = parseFloat(cs.width || "0");
      if (cs.display === "none" || width === 0) {
        return true;
      }
    }
  } catch (e) {
    // no-op
  }
  return false;
}

function syncSidebarWrapper() {
  const wrap = document.querySelector(".sidebar-wrapper");
  if (!wrap) return;

  const collapsed = isSidebarCollapsed();
  if (collapsed) {
    wrap.classList.add("is-collapsed");
    // Inline fallbacks in case other CSS fights specificity
    wrap.style.display = "none";
    wrap.style.visibility = "hidden";
    wrap.style.width = "0";
    wrap.style.overflow = "hidden";
  } else {
    wrap.classList.remove("is-collapsed");
    wrap.style.removeProperty("display");
    wrap.style.removeProperty("visibility");
    wrap.style.removeProperty("width");
    wrap.style.removeProperty("overflow");
  }
}

function attachObservers() {
  // Observe class changes on <html> and <body>
  const observer = new MutationObserver(() => syncSidebarWrapper());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Observe likely inner sidebar container if present
  const inner = document.querySelector(
    ".sidebar-container, aside.sidebar, .sidebar, .sidebar-panel"
  );
  if (inner) {
    const innerObserver = new MutationObserver(() => syncSidebarWrapper());
    innerObserver.observe(inner, { attributes: true, attributeFilter: ["class", "style", "aria-hidden"] });
  }

  // Listen to clicks on the toggle button as an extra signal
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t) return;
      const el = t.closest && t.closest(".sidebar-toggle, [data-sidebar-toggle], button[aria-controls='sidebar']");
      if (el) {
        // schedule after core finishes toggling
        setTimeout(syncSidebarWrapper, 0);
      }
    },
    true
  );

  // Keep in sync on resize
  window.addEventListener("resize", () => syncSidebarWrapper(), { passive: true });
}

export default {
  name: "sidebar-wrapper-sync",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      const setup = () => {
        attachObservers();
        syncSidebarWrapper();
      };

      // Run on load
      setTimeout(setup, 0);

      // Re-run on route changes
      api.onPageChange(() => setTimeout(setup, 0));
    });
  },
};
