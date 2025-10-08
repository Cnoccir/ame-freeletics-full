# AME Freeletics Full Theme

This is a full Discourse theme that recreates the Freeletics forum visual design with AME branding.

Includes
- Dark color scheme (AME Dark)
- Background + glassmorphism panels
- Header label after logo
- Featured Topics and Banner styles
- Category header/banner styles
- Right sidebar (desktop) styles
- Mobile layout tweaks
- Homepage hero banner injected via JS (configurable via settings)
- Inter font import

Setup
1) Upload ZIP: Admin → Customize → Themes → Install → From your device → ame-freeletics-full.zip
2) Select the theme → Colors → choose "AME Dark".
3) Settings (Theme → Edit CSS/HTML → Settings):
   - background_image_url: upload background image and paste URL
   - banner_image_url: optional banner background
   - header_label_text: label after logo (e.g., "TechAssist")
   - banner_title_text / banner_subtitle_text
   - banner_cta_1_text/url and banner_cta_2_text/url
4) Ensure the theme is set as default for the site.

Optional components
- For content cards/feeds in the sidebar or featured topics list, install respective components if desired.

Notes
- This theme intentionally avoids importing Discourse’s compiled core CSS. It contains only the customizations extracted from Freeletics to remain compatible across Discourse versions.