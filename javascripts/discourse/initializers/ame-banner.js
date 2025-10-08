import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Show banner on homepage and categories
  api.onPageChange((url) => {
    const show = url === "/" || url.startsWith("/categories");
    document.documentElement.classList.toggle("ame-banner-visible", !!show);
  });

  api.decorateWidget("above-main-container:after", () => {
    // Only render if we want the banner visible
    if (!document.documentElement.classList.contains("ame-banner-visible")) return;

    const title = settings.banner_title_text || "AME TechAssist";
    const subtitle = settings.banner_subtitle_text || "Everybody is smarter than anybody.";
    const cta1Text = settings.banner_cta_1_text || "Search Technical Docs";
    const cta1Url = settings.banner_cta_1_url || "/search";
    const cta2Text = settings.banner_cta_2_text || "Ask Technical Question";
    const cta2Url = settings.banner_cta_2_url || "/new-topic";

    return [
      this.h("div.banner-box", [
        this.h("div.container", [
          this.h("div.section-header", [
            this.h("h2.x-title", title),
            this.h("div.colored-line"),
            this.h("p", subtitle),
          ]),
          this.h("div.cta-buttons", [
            this.h(
              "a.btn btn-primary",
              { attributes: { href: cta1Url } },
              this.h("span.d-button-label", cta1Text)
            ),
            this.h(
              "a.btn btn-primary",
              { attributes: { href: cta2Url } },
              this.h("span.d-button-label", cta2Text)
            ),
          ]),
        ]),
      ]),
    ];
  });
});
