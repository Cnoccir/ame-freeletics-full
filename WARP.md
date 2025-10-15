# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Common commands

- Create a distributable ZIP from the current Git HEAD (recommended):
```pwsh path=null start=null
git --no-pager archive --format=zip -o ame-freeletics-full.zip HEAD
```
- Create a ZIP from working directory (PowerShell), excluding the output file:
```pwsh path=null start=null
$zip = "ame-freeletics-full.zip"
if (Test-Path $zip) { Remove-Item $zip }
$items = Get-ChildItem -Force -Recurse | Where-Object { $_.FullName -notmatch "\\.git(\\|$)" -and $_.FullName -notmatch "\\.warp(\\|$)" -and $_.FullName -ne (Resolve-Path $zip) }
Compress-Archive -Path $items -DestinationPath $zip -Force
```
- Install the theme into Discourse (from README): Admin → Customize → Themes → Install → From your device → upload ame-freeletics-full.zip, then select Colors → "AME Dark" and configure Theme Settings as needed.

Architecture and structure (big picture)

- Discourse theme (about.json)
  - Defines theme metadata, declares component=true, includes color_schemes ("AME Dark") and asset references.
- Theme settings (settings.yml, settings.yaml)
  - settings.yml declares the settings schema Discourse reads (types, defaults, descriptions).
  - settings.yaml contains additional defaults and descriptive texts used by styles and templates. Prefer editing settings.yml for schema changes.
  - Settings are consumed in templates via the theme-setting helper and in SCSS via SASS variables (e.g., $brand_logo_url, $enable_brand_header).
- Styles
  - common/common.scss: global styles, background overlays, glass panels, layout, banners, hero and category cards.
  - desktop/desktop.scss and mobile/mobile.scss: viewport-specific adjustments.
  - common/color_definitions.scss: CSS custom properties for palette and tokens.
  - common/head_tag.html: external font include (Adobe Fonts) and CSP upgrade-insecure-requests meta; altering these affects font loading and CSP.
- Ember/Glimmer components and Discourse connectors
  - javascripts/discourse/components/ame-hero.gjs: Glimmer component used by connectors to render the hero area on discovery pages.
  - javascripts/discourse/connectors/*: Hooks into Discourse outlet points.
    - below-site-header/header-banner.*: Rotating quotes banner; JS sets --ame-banner-height CSS variable to offset content.
    - before-list-area/ame-hero-connector.*: Renders category/CTA cards (labels/links come from theme settings).
    - discovery-list-container-top/homepage-splash.*: Logged-out splash stub.
- Initializers (Discourse plugin API)
  - javascripts/discourse/initializers/hub-app.js: Detects DiscourseHub WebView and toggles is-hub-app class for mobile tweaks.
  - javascripts/discourse/initializers/sidebar-wrapper-sync.js: Uses withPluginApi and MutationObserver to mirror inner sidebar collapse state to .sidebar-wrapper, ensuring layout reflows when collapsed; listens on page changes and resize.

Key settings and configuration (from README and settings files)

- After install, set Colors to "AME Dark" (defined in about.json).
- Configure theme settings (Theme → Edit CSS/HTML → Settings), including:
  - Background and banner images (background_image_url, banner_image_url or uploads).
  - Header branding (enable_brand_header, brand_logo_url, header_label_text).
  - Hero/navigation labels and links (hero_card_* and banner_cta_*).
  - Optional login hero background (login_background_image_url).

Notes and gotchas

- This repo contains both settings.yml (Discourse schema) and settings.yaml (additional defaults). Keep them in sync; Discourse consumes settings.yml for types and admin UI.
- JavaScript initializers rely on withPluginApi("0.8.31") and DOM observation; regressions in outlet markup or class names may require selector updates.
- Head tag includes Adobe Fonts; if fonts fail to load, verify the Typekit project and CSP. Changes here affect site-wide typography.
