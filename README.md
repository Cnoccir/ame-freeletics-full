# AME Freeletics Full Theme

This is a full Discourse theme that recreates the Freeletics forum visual design with AME branding.

## Features

- Dark color scheme (AME Dark)
- Background + glassmorphism panels
- Header label after logo
- Featured Topics and Banner styles
- Category header/banner styles
- Right sidebar (desktop) styles
- Mobile layout tweaks
- Homepage hero banner injected via JS (configurable via settings)
- Inter font import
- **Forum structure management** with automated topic creation and hero card linking

## Quick Start

### 1. Install Theme

1) Upload ZIP: Admin → Customize → Themes → Install → From your device → ame-freeletics-full.zip
2) Select the theme → Colors → choose "AME Dark"
3) Configure settings (Theme → Edit CSS/HTML → Settings):
   - `background_image_url`: upload background image and paste URL
   - `banner_image_url`: optional banner background
   - `header_label_text`: label after logo (e.g., "TechAssist")
   - `banner_title_text` / `banner_subtitle_text`
   - `banner_cta_1_text/url` and `banner_cta_2_text/url`
4) Ensure the theme is set as default for the site

### 2. Set Up Forum Structure (Recommended)

This theme implements a **4-pillar forum structure**:
- **0. Assistance** - Active troubleshooting (Hero Card 1)
- **1. Insights** - Field lessons learned (Hero Card 2)
- **2. Guides** - Standard procedures (Hero Card 3)
- **3. Resources** - Official documentation
- **AI Assistant (AME-Bot)** - Preserved on Hero Card 4

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete instructions.**

Quick setup:
1. Create the 4 master topics manually in Discourse (copy/paste from `content/topics/`)
2. Note the topic IDs from the URLs
3. Update hero card URLs in Admin → Customize → Themes → Settings:
   - `hero_card_1_url: /t/123` (Assistance topic ID)
   - `hero_card_2_url: /t/124` (Insights topic ID)
   - `hero_card_3_url: /t/125` (Guides topic ID)

## Optional Components

- For content cards/feeds in the sidebar or featured topics list, install respective components if desired

## Architecture Notes

- This theme intentionally avoids importing Discourse's compiled core CSS
- Contains only the customizations extracted from Freeletics to remain compatible across Discourse versions
- Forum structure managed via `config/forum_topics.json` and automated sync script

## Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions (start here!)
- **[content/topics/](content/topics/)** - Master topic templates (copy/paste to Discourse)
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick decision tree and commands

### Optional: API Automation

The `scripts/` folder contains an **optional** Node.js script that can automate topic creation via the Discourse API. This is useful for bulk setup but **not required** for normal operation. See [FORUM_SETUP.md](FORUM_SETUP.md) if interested.
