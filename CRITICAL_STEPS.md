# ⚠️ CRITICAL INSTALLATION STEPS ⚠️

## THE PROBLEM

**Git sync does NOT automatically update your Discourse theme!**

You MUST manually upload the files through the Discourse admin panel OR use the Discourse Theme CLI.

---

## OPTION 1: Manual Upload (RECOMMENDED)

### Step 1: Open Discourse Admin Panel

```
1. Go to localhost:4000/admin
2. Click "Customize" in left sidebar
3. Click "Themes"
4. Click on "AME Freeletics Full" (or create new theme)
```

### Step 2: Upload CSS

```
1. Click "Edit CSS/HTML" button
2. Click "Common" tab
3. Click "CSS" sub-tab
4. COPY ENTIRE contents of: common/common.scss
5. PASTE into the editor
6. Click "Save"
```

**File to copy from:**
`C:\Users\tech\Projects\ame-freeletics-full\common\common.scss`

### Step 3: Upload JavaScript Initializer

```
1. Still in theme editor
2. Go to "JavaScript" section (top tabs)
3. Add new file: discourse/initializers/ame-banner.js
4. COPY contents of: javascripts/discourse/initializers/ame-banner.js
5. PASTE into editor
6. Click "Save"
```

**File to copy from:**
`C:\Users\tech\Projects\ame-freeletics-full\javascripts\discourse\initializers\ame-banner.js`

### Step 4: Upload Connector Template

```
1. Still in theme editor
2. Go to "JavaScript" section
3. Add new file: discourse/connectors/above-main-container/ame-hero.hbs
4. COPY contents of: javascripts/discourse/connectors/above-main-container/ame-hero.hbs
5. PASTE into editor
6. Click "Save"
```

**File to copy from:**
`C:\Users\tech\Projects\ame-freeletics-full\javascripts\discourse\connectors\above-main-container\ame-hero.hbs`

### Step 5: Upload Connector JavaScript

```
1. Still in theme editor
2. Go to "JavaScript" section
3. Add new file: discourse/connectors/above-main-container/ame-hero.js
4. COPY contents of: javascripts/discourse/connectors/above-main-container/ame-hero.js
5. PASTE into editor
6. Click "Save"
```

**File to copy from:**
`C:\Users\tech\Projects\ame-freeletics-full\javascripts\discourse\connectors\above-main-container\ame-hero.js`

### Step 6: Upload Head Tag

```
1. Go back to "Edit CSS/HTML"
2. Click "Common" tab
3. Click "</head>" sub-tab
4. COPY contents of: common/head_tag.html
5. PASTE into editor
6. Click "Save"
```

**File to copy from:**
`C:\Users\tech\Projects\ame-freeletics-full\common\head_tag.html`

### Step 7: Configure Settings

```
1. In theme panel, click "Settings" tab
2. Find or add these settings:
   - header_label_text = "TechAssist"
   - background_image_url = "/uploads/default/original/1X/yourimage.png"
3. Click "Save"
```

### Step 8: Rebuild Theme

```
1. In theme list, find your theme
2. Click the three dots (...)
3. Click "Rebuild"
4. Wait for success message
```

### Step 9: Set as Default

```
1. In theme list
2. Click "Set as default" button
3. Confirm
```

### Step 10: Test

```
1. Open new incognito window
2. Go to: localhost:4000/categories
3. Hard refresh: Ctrl+F5
4. You should see:
   - Rotating quote
   - Dark hero panel
   - 4 category cards
   - NO "Welcome back" message
```

---

## OPTION 2: Use Discourse Theme CLI

### Install Theme CLI:

```powershell
npm install -g discourse-theme-cli
```

### Setup:

```powershell
cd C:\Users\tech\Projects\ame-freeletics-full

# Create theme.yml if it doesn't exist
discourse_theme new

# Follow prompts:
# - Name: AME Freeletics Full
# - About URL: https://example.com
# - License: MIT
```

### Watch and Sync:

```powershell
discourse_theme watch --url http://localhost:4000
```

This will automatically sync file changes to your local Discourse instance.

---

## DEBUGGING

### If Hero Still Doesn't Show:

**Check in Browser Console (F12):**

```javascript
// 1. Check if elements exist in DOM
console.log('Quote container:', document.querySelector('#ame-quote-slot'));
console.log('Hero panel:', document.querySelector('.ame-hero-panel'));

// 2. Check body classes
console.log('Body classes:', document.body.className);
// Should include "categories-index" or "navigation-categories"

// 3. Check if JavaScript loaded
console.log('Banner init:', window.discoursePlaceholder);

// 4. Force show elements
const quote = document.querySelector('#ame-quote-slot');
if (quote) {
  quote.style.cssText = 'display: block !important; visibility: visible !important;';
  console.log('Quote forced visible');
} else {
  console.error('Quote container not found in DOM - connector not loading!');
}
```

### If Connector Not Loading:

**Possible causes:**

1. ❌ **File path wrong in Discourse admin** - Must be exact:
   - `discourse/connectors/above-main-container/ame-hero.hbs`
   - `discourse/connectors/above-main-container/ame-hero.js`

2. ❌ **Theme not rebuilt** - Always rebuild after changes

3. ❌ **Browser cache** - Clear completely + hard refresh

4. ❌ **Wrong page** - Must be on `/categories` not `/latest`

5. ❌ **Syntax error in files** - Check browser console for errors

### Emergency Workaround:

If connector absolutely won't load, add this to bottom of common.scss:

```scss
/* EMERGENCY: Hide unwanted elements */
body.categories-index .welcome-wrapper,
body.categories-index #list-area > .contents {
  display: none !important;
}

/* EMERGENCY: Show message */
body.categories-index #main-outlet::before {
  content: "⚠️ Theme connector not loading. Check Discourse admin panel.";
  display: block;
  background: #ff6b6b;
  color: white;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
}
```

---

## VERIFY FILE STRUCTURE IN DISCOURSE ADMIN

After uploading, your theme JavaScript section should show:

```
javascripts/
  discourse/
    connectors/
      above-main-container/
        ame-hero.hbs  ← Template
        ame-hero.js   ← Connector logic
    initializers/
      ame-banner.js   ← Quote rotation
```

---

## COMMON MISTAKES

### ❌ MISTAKE 1: "I pushed to Git"
**Problem**: Git sync doesn't automatically update Discourse
**Solution**: Upload files manually via admin panel OR use discourse_theme CLI

### ❌ MISTAKE 2: "I refreshed the page"
**Problem**: Browser cache is aggressive
**Solution**: Hard refresh (Ctrl+F5) + clear cache + incognito mode

### ❌ MISTAKE 3: "I'm on the homepage"
**Problem**: Hero only shows on `/categories`
**Solution**: Navigate specifically to `localhost:4000/categories`

### ❌ MISTAKE 4: "Theme shows as active"
**Problem**: Active doesn't mean files are uploaded
**Solution**: Check actual file contents in theme editor

### ❌ MISTAKE 5: "I saved the files"
**Problem**: Saving doesn't rebuild the theme
**Solution**: Click "..." → "Rebuild" after saving

---

## SUCCESS CHECKLIST

When properly installed, you will see:

✅ **URL**: `localhost:4000/categories`
✅ **Large rotating quote** above the dark panel
✅ **Quote changes** every 5.5 seconds
✅ **Dark translucent panel** with blur effect
✅ **Navigation tabs**: subcategories | tags | Latest | Top
✅ **Four category cards** with titles + subtitles
✅ **Blue left borders** on cards (4px)
✅ **NO** "Welcome back, admin!" message
✅ **NO** search box in panel
✅ **NO** default category list

---

## IF STILL NOT WORKING

### Take Screenshots:

1. Discourse Admin → Themes → Your Theme → Edit CSS/HTML → JavaScript section (show file structure)
2. Browser Console (F12 → Console) - show any errors
3. Browser DevTools (F12 → Elements) - search for "ame-quote"
4. Your `/categories` page

### Check These:

```
1. Theme is set as DEFAULT (not just active)
2. Homepage setting = "categories"
3. Theme was REBUILT after file changes
4. Browser cache was CLEARED
5. You're on /categories page (not /latest)
6. No JavaScript errors in console
7. Files have correct exact paths in admin panel
```

---

**CRITICAL**: Git push does NOT equal theme update. You MUST upload files through Discourse admin panel!

---

**Last Updated**: October 8, 2025
**Status**: ⚠️ REQUIRES MANUAL ADMIN PANEL UPLOAD
