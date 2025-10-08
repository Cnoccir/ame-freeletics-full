# Freeletics Discourse Theme Analysis

**Scraped:** October 7, 2025
**Base URL:** https://forum.freeletics.com

---

## Executive Summary

Freeletics uses a **custom dark theme** for their Discourse forum with:
- **Custom typography** using Aktiv Grotesk font family
- **Dark color scheme** with blue accents
- **Featured topics component** on homepage
- **Custom banner system**
- Several **theme components** from the Discourse marketplace

---

## 1. Color Scheme (Dark Theme)

### Primary Colors
```css
--primary: #ECEFF1          /* Light text color on dark background */
--secondary: #263238        /* Dark background color */
--tertiary: #0277BD         /* Blue accent/link color */
--quaternary: #0277BD       /* Same as tertiary */
```

### Header Colors
```css
--header_background: #263238   /* Dark gray header */
--header_primary: #ECEFF1      /* Light header text */
```

### Accent Colors
```css
--highlight: #FFB36B    /* Orange highlight */
--danger: #FF3333       /* Red for errors/warnings */
--success: #00A1A1      /* Teal for success states */
--love: #FF3333         /* Red for likes/hearts */
```

### State Colors
```css
--d-selected: #293137   /* Selected item background */
--d-hover: #2d363d      /* Hover state background */
```

---

## 2. Typography

### Custom Font: Aktiv Grotesk
Freeletics uses **Aktiv Grotesk** as their primary font family. They've loaded 4 font files:
- `aktivgrotesk-rg.woff2` (Regular - 67.8 KB)
- `aktivgrotesk-md.woff2` (Medium - 80 KB)
- `aktivgrotesk-bd.woff2` (Bold - 76.5 KB)
- `AktivGroteskEx_Rg.woff2` (Extended Regular - 64.2 KB)

### Monospace Font: JetBrains Mono
For code blocks:
```css
--d-font-family--monospace: JetBrains Mono, Consolas, Monaco, monospace
```

### Font Settings
```css
--font-family: Arial, sans-serif  /* Fallback to Arial */
--heading-font-family: Arial, sans-serif
```

---

## 3. Theme Components Identified

### Base Theme
- **Visual Refresh Colors (2022)** - Modern dark color scheme

### Active Plugins & Components
Based on the CSS files collected, Freeletics is using:

1. **discourse-policy** - Policy acceptance functionality
2. **discourse-akismet** - Spam protection
3. **discourse-adplugin** - Advertisement management
4. **checklist** - Task list functionality
5. **discourse-details** - Collapsible details/spoilers
6. **discourse-ai** - AI features integration
7. **discourse-gamification** - User engagement/points
8. **discourse-cakeday** - User anniversary celebrations
9. **discourse-chat-integration** - External chat integrations
10. **discourse-data-explorer** - SQL query interface
11. **discourse-local-dates** - Timezone-aware dates
12. **discourse-lazy-videos** - Lazy-load video embeds
13. **discourse-reactions** - Custom emoji reactions
14. **discourse-solved** - Solution marking for topics
15. **discourse-presence** - User presence indicators
16. **discourse-topic-voting** - Feature voting system
17. **discourse-user-notes** - Staff notes on users
18. **discourse-yearly-review** - Annual recap features
19. **spoiler-alert** - Spoiler blur functionality
20. **discourse-templates** - Template system
21. **poll** - Native polling feature
22. **footnote** - Footnote support

### Custom Theme Components (IDs detected)
- Theme ID 3 - Featured Topics component
- Theme ID 6, 8, 9, 10, 11, 12 - Additional customizations
- **hosted-site** - Discourse hosting-specific features

---

## 4. Custom Banner System

Freeletics has a custom banner configuration:
```css
--banner-bg-color: #263238
--banner-primary-text: #000
--banner-secondary-text: #FF6C00  /* Orange accent */
--banner-link-text: #0f82af       /* Blue links */
--banner-bg-img: url(https://cdck-file-uploads-europe1.s3.dualstack.eu-west-1.amazonaws.com/flex013/uploads/freeletics/original/2X/f/fdc144b17668f8ed2466bb6120eb10287db55eff.png)
```

---

## 5. Featured Topics Component

One of the most prominent customizations is the **Featured Topics** component displayed on the homepage. Key features:

### Layout
- Horizontal carousel-style display
- Responsive breakpoints for mobile
- Featured topic images (200px height)
- Maximum width: 500px per topic
- Navigation buttons for browsing

### CSS Classes
- `.featured-topic-wrapper` - Main container
- `.featured-topics-controls` - Control buttons
- `.featured-topic` - Individual topic card
- `.featured-topic-image` - Topic thumbnail

### Responsive Behavior
- Desktop: Shows 3-5 topics
- Tablet (800-999px): Shows 2-3 topics
- Mobile (600px): Shows 1-2 topics
- Mobile (<450px): Shows 1 topic

### Tag System
- Uses `featured` tag to mark topics
- Hidden from non-staff users by default

---

## 6. Layout Measurements

### Shadows & Depth
```css
--shadow-modal: 0 8px 60px rgba(0, 0, 0, 1)
--shadow-composer: 0 -1px 40px rgba(0, 0, 0, 0.35)
--shadow-card: 0 4px 14px rgba(0, 0, 0, 0.5)
--shadow-dropdown: 0 2px 12px 0 rgba(0, 0, 0, 0.25)
```

### Border Colors
```css
--content-border-color: var(--primary-low)
--input-border-color: var(--primary-400)
```

---

## 7. How to Recreate This Theme

### Step 1: Set Base Theme to Dark Mode
In your Discourse admin:
1. Go to **Customize** → **Themes**
2. Select your theme or create new one
3. Under **Colors**, select **Dark** scheme or create custom dark scheme

### Step 2: Configure Color Palette
In **Theme Settings** → **Colors**, set:
- Primary: `#ECEFF1`
- Secondary: `#263238`
- Tertiary: `#0277BD`
- Quaternary: `#0277BD`
- Header Background: `#263238`
- Header Primary: `#ECEFF1`
- Highlight: `#FFB36B`
- Danger: `#FF3333`
- Success: `#00A1A1`

### Step 3: Install Custom Fonts
Add to **Common** → **CSS**:
```css
@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('YOUR_AKTIV_GROTESK_URL.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('YOUR_AKTIV_GROTESK_BOLD_URL.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

:root {
  --font-family: 'Aktiv Grotesk', Arial, sans-serif;
  --heading-font-family: 'Aktiv Grotesk', Arial, sans-serif;
}
```

### Step 4: Install Theme Components
Install these components from Discourse:
1. **Discourse Gamification**
2. **Discourse Solved**
3. **Discourse Reactions**
4. **Discourse Topic Voting**
5. **Discourse Chat Integration**
6. **Discourse AI** (if needed)
7. **Poll** (built-in, just enable)
8. **Featured Topics** - [Custom component from Theme Creator]

### Step 5: Add Featured Topics Component
Create a new **Theme Component**:

**Name:** Featured Topics

**Common CSS:** (Use the CSS from `common_theme_3_*.css` collected)

**Settings to add:**
- `featured_topics_enabled` (boolean)
- `featured_topics_count` (integer, default: 5)
- `featured_tag_name` (string, default: "featured")

### Step 6: Custom Shadows & Effects
Add to **Common** → **CSS**:
```css
:root {
  --shadow-modal: 0 8px 60px rgba(0, 0, 0, 1);
  --shadow-composer: 0 -1px 40px rgba(0, 0, 0, 0.35);
  --shadow-card: 0 4px 14px rgba(0, 0, 0, 0.5);
  --shadow-dropdown: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
}
```

### Step 7: Configure Banner (Optional)
If you want a custom banner, add to **Common** → **CSS**:
```css
:root {
  --banner-bg-color: #263238;
  --banner-primary-text: #000;
  --banner-secondary-text: #FF6C00;
  --banner-link-text: #0f82af;
  --banner-bg-img: url('YOUR_BANNER_IMAGE_URL');
}
```

---

## 8. Key Files Reference

All collected assets are in: `data/freeletics/assets/`

### Most Important Files to Review:
1. **color_definitions_visual-refresh-colors-2022_*.css** - Complete color system
2. **common_theme_3_*.css** - Featured topics component
3. **desktop_43d2a9e*.css** - Desktop-specific styles
4. **mobile_43d2a9e*.css** - Mobile-specific styles
5. **aktivgrotesk-*.woff2** - Custom font files

---

## 9. Plugin Configuration Tips

### Discourse Gamification
- Enables leaderboards and points
- Check `discourse-gamification_*.css` for styling

### Discourse Solved
- Allows marking solutions in topics
- Orange checkmark matches highlight color

### Discourse Reactions
- Custom emoji reactions beyond default likes
- Uses same accent colors

---

## 10. Next Steps

1. ✅ **Review collected CSS files** in `data/freeletics/assets/`
2. ✅ **Upload Aktiv Grotesk fonts** to your CDN/hosting
3. ⬜ **Create new theme** in Discourse admin panel
4. ⬜ **Apply color scheme** from Section 2
5. ⬜ **Add custom CSS** for fonts and shadows
6. ⬜ **Install plugins** listed in Section 3
7. ⬜ **Create Featured Topics component** using collected CSS
8. ⬜ **Test responsive behavior** on mobile/tablet
9. ⬜ **Fine-tune spacing and typography**
10. ⬜ **Add custom banner** if desired

---

## 11. Additional Notes

- Freeletics is using **Discourse Hosted** (see `hosted-site_*.css`)
- The site uses **Visual Refresh** UI updates from 2022
- They have heavy gamification features enabled
- Mobile experience is well-optimized with breakpoints
- Dark theme provides good contrast and readability

---

## Resources

- **Discourse Theme CLI:** https://meta.discourse.org/t/discourse-theme-cli/82950
- **Theme Component Guide:** https://meta.discourse.org/t/developer-s-guide-to-discourse-themes/93648
- **CSS Variables Reference:** https://meta.discourse.org/t/customize-your-site-with-css-variables/171789

---

**Generated by Discourse Theme Scraper**
