// Detect Discourse Hub app (WebView) and add a class for targeted mobile tweaks
// Safe: UA token 'DiscourseHub' is used by the official app
export default {
  name: "hub-app-detector",
  initialize() {
    try {
      const ua = (navigator.userAgent || "").toLowerCase();
      if (ua.includes("discoursehub")) {
        document.documentElement.classList.add("is-hub-app");
      }
    } catch (e) {
      // no-op
    }
  }
};
