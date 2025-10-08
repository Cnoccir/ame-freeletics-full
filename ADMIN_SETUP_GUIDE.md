# AME TechAssist Admin Setup Guide

## Overview
This guide walks you through configuring your Discourse admin panel to complete the AME TechAssist theme setup, matching the Freeletics-inspired design.

---

## Prerequisites
- ✅ Theme files uploaded to Discourse
- ✅ Admin access to your Discourse instance
- ✅ AME logo file ready for upload

---

## Step 1: Upload and Set Theme (5 min)

### 1.1 Install Theme
1. Go to **Admin** → **Customize** → **Themes**
2. Click **Install** → **From a git repository** or **Upload a theme**
3. Point to your theme repository or upload the theme folder
4. Click **Install**

### 1.2 Apply Color Scheme
1. In your theme, go to the **Colors** tab
2. Select **AME Dark** color scheme (should be included in theme)
3. If not present, create new scheme with these values:
   ```
   Primary: ECEFF1
   Secondary: 263238
   Tertiary: 003d6b
   Quaternary: 0078d4
   Header Background: 263238
   Header Primary: ECEFF1
   Highlight: FFB36B
   Danger: FF3333
   Success: 00A1A1
   Love: FF3333
   ```

### 1.3 Set as Default
1. Return to **Themes** list
2. Click **Set as default** on "AME Freeletics Full"

---

## Step 2: Upload Your Logo (5 min)

### 2.1 Upload Logo Image
1. Go to **Admin** → **Customize** → **Themes** → Select your theme
2. Click **Settings** tab
3. Find the "Site Logo" or "Logo" setting
4. Upload your AME logo file (PNG/SVG recommended, ideally 200x40px)

**OR** upload directly:
1. Go to **Admin** → **Settings** → **Required**
2. Find **logo** setting
3. Upload your logo

### 2.2 Update Header Label
1. In theme **Settings**, find `header_label_text`
2. Set to: `TechAssist`
   - This will appear next to your logo like "AME | TechAssist"

### 2.3 Upload Background Image (Optional)
1. Go to **Admin** → **Settings** → **Basic** → **Background**
2. OR in theme settings, find `background_image_url`
3. Upload your background image (should be 1920x1080 or larger)

---

## Step 3: Configure Homepage Settings (5 min)

### 3.1 Set Homepage to Categories
1. Go to **Admin** → **Settings** → **Basic**
2. Find **top menu** setting
3. Ensure "categories" is in the list
4. Find **homepage** setting
5. Set to: `categories`

This ensures the hero panel shows on your homepage.

---

## Step 4: Verify Design Elements (3 min)

### 4.1 Check Rotating Quotes
Visit your homepage and verify:
- ✅ Large quote displays above the main panel
- ✅ Quote rotates every 5.5 seconds with fade effect
- ✅ Quotes are:
  1. "ALONE WE CAN DO SO LITTLE; TOGETHER WE CAN DO MUCH."
  2. "KNOWLEDGE SHARED IS KNOWLEDGE SQUARED."
  3. "RAISE THE FLOOR, THEN RAISE THE CEILING."
  4. "PUT KNOWLEDGE WHERE PEOPLE TRIP OVER IT."
  5. "EVERYBODY IS SMARTER THAN ANYBODY."
  6. "KNOWLEDGE IS LIKE MONEY: TO BE OF VALUE IT MUST CIRCULATE."
  7. "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT."

### 4.2 Check Hero Panel
Verify the dark glass panel shows:
- ✅ Navigation tabs: subcategories | tags | Latest | Top
- ✅ Four category cards in 2x2 grid (4 columns on desktop):
  1. **Knowledge Base** - Vendor Manuals, Specs & Docs
  2. **Tech Community** - Ask Questions & Share Expertise
  3. **How-To & Troubleshooting** - Guides, Tutorials & Fixes
  4. **AI Assistant (AME-Bot)** - Get Instant Answers

### 4.3 Check Header
- ✅ AME logo displays on left
- ✅ "TechAssist" label appears next to logo with divider
- ✅ No Discourse branding visible

---

## Step 5: Create Required Categories/Tags (10 min)

To make the hero panel links work, create these:

### 5.1 Create Tags
1. Go to **Admin** → **Tags**
2. Create these tags:
   - `knowledge-base`
   - `how-to`

### 5.2 Create Categories (if needed)
1. Go to **Admin** → **Categories**
2. Create or verify:
   - General discussion category
   - AI Assistant category (link it in the 4th card)

### 5.3 Update Links in Template (Optional)
If your URLs differ, edit `javascripts/discourse/connectors/above-main-container/ame-hero.hbs`:
- Line 22: Knowledge Base link → Update `/tags/knowledge-base`
- Line 26: Tech Community link → Update `/c`
- Line 30: How-To link → Update `/tags/how-to`
- Line 34: AI Assistant link → Update `/search?q=category%3Aai-assistant`

---

## Step 6: Mobile Testing (5 min)

### 6.1 Test on Mobile
1. Open your site on mobile device or use browser DevTools
2. Verify:
   - ✅ Quotes are readable (smaller but still bold)
   - ✅ Hero panel is scrollable if needed
   - ✅ Cards stack vertically (1 column)
   - ✅ Navigation tabs wrap properly

---

## Step 7: Fine-Tuning (Optional)

### 7.1 Adjust Colors (Optional)
If AME brand colors differ:
1. Go to **Customize** → **Themes** → **Colors**
2. Edit:
   - **Tertiary**: Primary brand blue (currently `#003d6b`)
   - **Quaternary**: Secondary brand blue (currently `#0078d4`)

### 7.2 Customize Quotes (Optional)
To change quotes:
1. Edit `javascripts/discourse/initializers/ame-banner.js`
2. Update the `quotes` array (lines 9-16)
3. Save and rebuild theme

### 7.3 Adjust Card Descriptions (Optional)
To change card text:
1. Edit `javascripts/discourse/connectors/above-main-container/ame-hero.hbs`
2. Update:
   - `.ame-card__title` - Main heading
   - `.ame-card__sub` - Subtitle description

---

## Troubleshooting

### Logo Not Showing?
- Check file size (should be < 1MB)
- Try SVG or PNG format
- Clear browser cache (Ctrl+F5)
- Check **Admin** → **Settings** → **logo** setting

### Quotes Not Rotating?
- Open browser console (F12) and check for JavaScript errors
- Verify JavaScript is enabled
- Check that theme includes `javascripts/discourse/initializers/ame-banner.js`
- Try clearing browser cache

### Hero Panel Not Showing?
- Verify you're on the homepage (categories page)
- Check **homepage** setting is set to `categories`
- Ensure theme is set as default
- Check browser console for CSS errors

### Cards Look Wrong?
- Verify color scheme is applied correctly
- Check that all CSS files loaded (no 404 errors)
- Try rebuilding theme: **Admin** → **Customize** → **Themes** → **Rebuild**
- Clear browser cache

### Mobile Layout Broken?
- Check responsive CSS loaded
- Test in actual mobile browser (not just DevTools)
- Verify viewport meta tag is present
- Check for JavaScript errors on mobile

---

## Comparison Checklist

Use this to verify your site matches the Freeletics inspiration:

| Element | Freeletics Reference | Your Implementation | Status |
|---------|---------------------|---------------------|--------|
| Header logo | Small, left-aligned | AME logo, left | ☐ |
| Header label | "Forum" next to logo | "TechAssist" | ☐ |
| Motto/Quote | "#NEVERSETTLE" large text | Rotating quotes | ☐ |
| Glass panel | Dark translucent | Dark translucent | ☐ |
| Navigation tabs | Simple text links | subcategories, tags, etc. | ☐ |
| Category cards | Grid layout, minimal | 4-card grid with titles | ☐ |
| Card style | Left border accent | Blue left border | ☐ |
| Card text | Title + subtitle | Title + description | ☐ |
| Background | Fixed image | Your custom image | ☐ |
| Mobile | Responsive stacking | Stacks vertically | ☐ |

---

## Next Steps

After setup is complete:

1. **Test all links** - Click each card to ensure they go to the right place
2. **Populate content** - Add topics to your categories/tags
3. **Monitor feedback** - Ask users about readability and usability
4. **Iterate** - Adjust colors, text, or layout based on feedback

---

## Support & References

- **Discourse Meta**: https://meta.discourse.org
- **Theme Development Guide**: https://meta.discourse.org/t/93648
- **Color Scheme Guide**: https://meta.discourse.org/t/171789
- **Freeletics Reference**: Stored in `.data/freeletics/` folder

---

**Estimated Total Setup Time**: 30-40 minutes

**Last Updated**: October 2025
