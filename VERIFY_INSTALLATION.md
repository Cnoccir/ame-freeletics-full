# Installation Verification Guide

## Current Status Based on Your Screenshot

❌ **Quote not showing** - Large rotating quote should be above the dark panel
❌ **"Welcome back, admin!" visible** - Should be hidden
❌ **Default category list showing** - Should be hidden  
❌ **Cards look plain** - Need better styling with blue borders

---

## Step-by-Step Fix

### 1. Verify You're on the Correct Page ✅

**CRITICAL**: The hero only shows on the categories page!

- ✅ GO TO: `localhost:4000/categories` 
- ❌ NOT: `localhost:4000/latest`
- ❌ NOT: `localhost:4000/`

Check your URL bar - it must say `/categories`

---

### 2. Set Homepage Setting ✅

```
Admin → Settings → Basic → Search for "homepage"
Set to: categories
Save
```

---

### 3. Rebuild Theme Completely ✅

```
1. Admin → Customize → Themes
2. Find "AME Freeletics Full"
3. Click the three dots (...)
4. Click "Rebuild"
5. Wait for "Theme installed successfully"
```

---

### 4. Clear All Caches ✅

**Browser Cache:**
```
Press: Ctrl + Shift + Delete
Select: "All time"
Check: Everything
Clear
```

**Then Hard Refresh:**
```
Press: Ctrl + F5 (or Cmd + Shift + R on Mac)
Do this 3-4 times
```

---

### 5. Verify Files in Theme ✅

Go to: `Admin → Customize → Themes → AME Freeletics Full`

Check these tabs have content:

**Common → CSS:**
- Should have content starting with `/* ========================================`
- Should be ~268 lines
- Search for "ame-quote" - should find it

**Common → `</head>`:**
- Should have Inter font link

**JavaScript:**
- Check `discourse/initializers/ame-banner.js` exists
- Should have ~44 lines
- Search for "quotes" array

**Connectors:**
- Check `discourse/connectors/above-main-container/ame-hero.hbs`
- Should have ~42 lines
- Search for "ame-quote-container"

---

### 6. Browser Console Check ✅

1. Open browser (F12)
2. Go to Console tab
3. Navigate to `/categories`
4. Look for errors (red text)

**Run these commands:**

```javascript
// Test 1: Check if quote container exists
console.log('Quote container:', document.querySelector('#ame-quote-slot'));
// Should return: <div id="ame-quote-slot"...>

// Test 2: Check if panel exists  
console.log('Hero panel:', document.querySelector('.ame-hero-panel'));
// Should return: <div class="ame-hero-panel"...>

// Test 3: Count cards
console.log('Card count:', document.querySelectorAll('.ame-card').length);
// Should return: 4

// Test 4: Check quote text
console.log('Quote text:', document.querySelector('.q-text')?.textContent);
// Should return a quote string

// Test 5: Check CSS loaded
const card = document.querySelector('.ame-card');
if (card) {
  const styles = window.getComputedStyle(card);
  console.log('Card border-left:', styles.borderLeftWidth, styles.borderLeftColor);
}
// Should show: "4px" and a color value
```

---

### 7. Check Body Classes ✅

In browser console:

```javascript
console.log('Body classes:', document.body.className);
// Should include: "navigation-categories" or "categories-index"
```

If it shows "latest" or "discovery-latest", you're on the WRONG PAGE!

---

## Common Issues & Solutions

### Issue: "Nothing Changed After Rebuild"

**Solution:**
```
1. Log out of Discourse
2. Close browser completely
3. Clear browser cache via OS:
   - Windows: Delete C:\Users\YourName\AppData\Local\Temp
   - Clear DNS: ipconfig /flushdns
4. Reopen browser in Incognito/Private mode
5. Log back in
6. Go to /categories
```

### Issue: "JavaScript Errors in Console"

**Solution:**
```
1. Check error message
2. If it says "ame-banner not found":
   - File path is wrong
   - Should be: javascripts/discourse/initializers/ame-banner.js
3. If it says "apiInitializer is not defined":
   - Discourse version too old (need 3.2.0+)
4. Rebuild theme again
```

### Issue: "CSS Not Loading"

**Solution:**
```
1. Check Network tab in browser DevTools (F12)
2. Filter by "CSS"
3. Look for any 404 errors (red)
4. If you see 404s, rebuild theme
5. Check file names match exactly (case-sensitive)
```

### Issue: "Quote Container Found But Empty"

**Solution:**
```javascript
// In console, manually trigger quote display:
const qText = document.querySelector('.q-text');
if (qText) {
  qText.textContent = "TEST QUOTE";
  console.log('Quote set to:', qText.textContent);
}
```

If this works, JavaScript isn't loading. Check:
- File is in correct location
- apiInitializer is imported correctly
- No JavaScript errors

---

## Success Checklist

When everything works, you should see:

✅ URL shows `/categories`
✅ Large quote visible above dark panel
✅ Quote changes every 5.5 seconds
✅ Dark translucent panel below quote
✅ Four navigation tabs in panel
✅ Four category cards with:
  - Bold white titles
  - Gray subtitles
  - Blue left border (4px)
  - Hover effect (lifts up slightly)
✅ NO "Welcome back" message
✅ NO default category list below
✅ NO search box in panel

---

## Nuclear Option (If Nothing Works)

1. **Export theme** (backup)
2. **Delete theme completely**
3. **Create NEW theme from scratch:**
   ```
   Admin → Customize → Themes → Install → Create New
   Name: AME TechAssist v2
   ```
4. **Upload files ONE BY ONE:**
   - First: common/common.scss
   - Save & Rebuild
   - Test (should see glass panel styling)
   - Then: javascripts/discourse/initializers/ame-banner.js
   - Save & Rebuild
   - Test (should see quotes)
   - Finally: ame-hero.hbs
   - Save & Rebuild
   - Test (should see full hero)
5. **Set as default**
6. **Test on /categories**

---

## Still Not Working?

### Take Screenshots:

1. **Browser Console** (F12 → Console tab)
2. **Network Tab** (F12 → Network → reload page)
3. **Elements Tab** (F12 → Elements → search for "ame-quote")
4. **Your /categories page** (full screenshot)

### Check File Line Counts:

```
common/common.scss - 268 lines
ame-hero.hbs - 42 lines  
ame-banner.js - 44 lines
```

If counts don't match, files weren't uploaded correctly.

---

## Quick Debug Code

Paste this in Common → `</head>` to force visibility:

```html
<script>
console.log("AME Debug: Starting...");

document.addEventListener("DOMContentLoaded", function() {
  console.log("AME Debug: DOM loaded");
  console.log("Body classes:", document.body.className);
  
  const quote = document.querySelector('#ame-quote-slot');
  const panel = document.querySelector('.ame-hero-panel');
  const cards = document.querySelectorAll('.ame-card');
  
  console.log("Quote found:", !!quote);
  console.log("Panel found:", !!panel);
  console.log("Cards found:", cards.length);
  
  if (quote) quote.style.cssText = "display: block !important; visibility: visible !important;";
  if (panel) panel.style.cssText = "display: block !important; visibility: visible !important;";
  
  // Hide unwanted elements
  const welcome = document.querySelector('.welcome-wrapper');
  const catList = document.querySelector('.category-list');
  if (welcome) welcome.style.display = 'none';
  if (catList) catList.style.display = 'none';
  
  console.log("AME Debug: Visibility forced");
});
</script>
```

Check console for debug messages.

---

**Last Updated**: October 8, 2025
**Version**: 2.0
