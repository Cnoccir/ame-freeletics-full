import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Toggle visibility class on home and categories
  api.onPageChange((url) => {
    const show = url === "/" || url.startsWith("/categories");
    document.documentElement.classList.toggle("ame-banner-visible", !!show);
  });

  // Render banner in the modern outlet API (avoids widget deprecation)
  api.renderInOutlet("above-main-container", (helper) => {
    if (!document.documentElement.classList.contains("ame-banner-visible")) return;

    const h = helper.h;
    const title = settings.banner_title_text || "AME TechAssist";
    const subtitle = settings.banner_subtitle_text || "Everybody is smarter than anybody.";
    const cta1Text = settings.banner_cta_1_text || "Search Technical Docs";
    const cta1Url = settings.banner_cta_1_url || "/search";
    const cta2Text = settings.banner_cta_2_text || "Ask Technical Question";
    const cta2Url = settings.banner_cta_2_url || "/new-topic";

    return h("div.banner-box", [
      h("div.container", [
        h("div.section-header", [
          h("h2.x-title", title),
          h("div.colored-line"),
          h("p", subtitle),
        ]),
        h("div.cta-buttons", [
          h("a.btn.btn-primary", { attributes: { href: cta1Url } }, [
            h("span.d-button-label", cta1Text),
          ]),
          h("a.btn.btn-primary", { attributes: { href: cta2Url } }, [
            h("span.d-button-label", cta2Text),
          ]),
        ]),
      ]),
    ]);
  });
});
