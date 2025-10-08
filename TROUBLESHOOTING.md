# Troubleshooting Display Issues

## Your Current Issues (Based on Screenshot)

### Issue 1: ❌ Rotating Quote Not Showing
**Symptom**: No large quote text visible above the dark panel

**Causes**:
1. JavaScript not loading/executing
2. Theme not applied to categories page
3. CSS display rules not working

**Solutions**:
```
1. Check browser console (F12) for JavaScript errors
2. Verify you're on /categories page (not /latest)
3. Hard refresh: Ctrl+Shift+R or Ctrl+F5
4. Check theme is set as default in Admin → Customize → Themes
5. Rebuild theme: Admin → Customize → Themes → [Your Theme] → Rebuild
```

**Test**:
- Open browser console
- Type: `document.querySelector('#ame-quote-slot')`
- Should return an element, not null
- Type: `document.querySelector('.q-text').textContent`
- Should show a quote

---

### Issue 2: ❌ "Welcome back, admin!" Showing
**Symptom**: Default Discourse welcome message and search box visible

**Causes**:
1. CSS hiding rules not applied
2. Theme not set as default
3. Cache issue

**Solutions**:
```
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+F5
3. Check Admin → Settings → Basic → homepage = "categories"
4. Rebuild theme in admin panel
5. Check browser console for CSS 404 errors
```

**Manual Fix**:
Add this to Admin → Customize → Themes → [Your Theme] → Common → CSS:
```css
body.navigation-categories .welcome-wrapper,
body.categories-index .welcome-wrapper {
  display: none !important;
}
```

---

### Issue 3: ❌ Default Category List Showing
**Symptom**: "General", "Staff", "Site Feedback" list appears below hero

**Causes**:
1. CSS not hiding default list
2. Multiple elements need to be hidden

**Solutions**:
```
1. Add to common.scss:
body.navigation-categories .category-list,
body.categories-index .category-list {
  display: none !important;
}

2. Rebuild theme
3. Clear browser cache
4. Hard refresh page
```

---

### Issue 4: ❌ Cards Missing Prominent Blue Border
**Symptom**: Blue left border not visible enough

**Fixed in Latest Code**:
- Border width increased from 3px to 4px
- Border color: `var(--tertiary)` (AME blue #003d6b)
- Hover changes to `var(--quaternary)` (lighter blue #0078d4)

**Verify**:
```
1. Inspect card element (F12)
2. Check computed styles
3. Look for: border-left: 4px solid #003d6b
4. If not present, rebuild theme
```

---

### Issue 5: ❌ Navigation Tabs Wrong
**Symptom**: Shows "tags | Latest | Top" but should show "subcategories | tags | Latest | Top"

**Already Fixed in Code**:
- Line 14 of ame-hero.hbs has "subcategories"

**If Still Wrong**:
```
1. Check you uploaded the latest ame-hero.hbs file
2. Rebuild theme completely
3. Clear browser cache
4. Check JavaScript console for template errors
```

---

## Quick Fix Checklist

Run through this in order:

### 1. Verify Files Uploaded ✅
```
- [ ] common/common.scss (latest version with all fixes)
- [ ] javascripts/discourse/connectors/above-main-container/ame-hero.hbs
- [ ] javascripts/discourse/initializers/ame-banner.js
```

### 2. Rebuild Theme ✅
```
1. Admin → Customize → Themes
2. Find "AME Freeletics Full"
3. Click it
4. Top right: Click "..." → Rebuild
5. Wait for rebuild to complete
```

### 3. Set Homepage ✅
```
1. Admin → Settings → Basic
2. Find "homepage" setting
3. Set to: categories
4. Click Save
```

### 4. Clear All Caches ✅
```
1. Browser: Ctrl+Shift+Delete → Clear all
2. Discourse: Admin → Dashboard → "Clear Cache"
3. Hard refresh: Ctrl+F5 multiple times
```

### 5. Check JavaScript ✅
```
1. Open browser console (F12)
2. Go to /categories page
3. Check for errors (red text)
4. Look for: "ame-banner" initializer loaded
```

---

## Verification Tests

### Test 1: Quote Rotation
```javascript
// In browser console:
setInterval(() => {
  console.log(document.querySelector('.q-text').textContent);
}, 6000);
// Should print different quotes every 6 seconds
```

### Test 2: Hero Panel Visible
```javascript
// In browser console:
const panel = document.querySelector('.ame-hero-panel');
console.log('Panel exists:', !!panel);
console.log('Panel visible:', window.getComputedStyle(panel).display !== 'none');
```

### Test 3: Cards Count
```javascript
// In browser console:
console.log('Card count:', document.querySelectorAll('.ame-card').length);
// Should return: 4
```

### Test 4: CSS Loaded
```javascript
// In browser console:
const card = document.querySelector('.ame-card');
const styles = window.getComputedStyle(card);
console.log('Border left:', styles.borderLeftWidth, styles.borderLeftColor);
// Should show: "4px" and rgb color
```

---

## Common Mistakes

### Mistake 1: Wrong Page
- ✅ CORRECT: `localhost:4000/categories`
- ❌ WRONG: `localhost:4000/latest`
- ❌ WRONG: `localhost:4000/`

**Fix**: Navigate to /categories page specifically

### Mistake 2: Theme Not Default
- Check: Admin → Customize → Themes
- Should see: "AME Freeletics Full" with green "Default" badge
- If not: Click theme → "Set as default"

### Mistake 3: Not Rebuilding After Changes
- **ALWAYS** rebuild theme after uploading new files
- Admin → Customize → Themes → [Theme] → ... → Rebuild

### Mistake 4: Browser Cache
- Modern browsers cache aggressively
- Use Ctrl+F5, not just F5
- Consider: Chrome DevTools → Network tab → "Disable cache" checkbox

---

## Force Visibility (Debug Mode)

If nothing works, try this temporary fix to force visibility:

### Add to Common → Head:
```html
<script>
document.addEventListener("DOMContentLoaded", function() {
  console.log("AME Debug: Forcing visibility...");
  
  // Force show quote
  const quote = document.querySelector('.ame-quote-container');
  if (quote) {
    quote.style.display = 'block';
    quote.style.visibility = 'visible';
    console.log("AME Debug: Quote container found and shown");
  } else {
    console.error("AME Debug: Quote container NOT found");
  }
  
  // Force show panel
  const panel = document.querySelector('.ame-hero-panel');
  if (panel) {
    panel.style.display = 'block';
    panel.style.visibility = 'visible';
    console.log("AME Debug: Hero panel found and shown");
  } else {
    console.error("AME Debug: Hero panel NOT found");
  }
  
  // Force hide welcome
  const welcome = document.querySelector('.welcome-wrapper');
  if (welcome) {
    welcome.style.display = 'none';
    console.log("AME Debug: Welcome hidden");
  }
  
  // Force hide category list
  const catList = document.querySelector('.category-list');
  if (catList) {
    catList.style.display = 'none';
    console.log("AME Debug: Category list hidden");
  }
});
</script>
```

Then check browser console for debug messages.

---

## Still Not Working?

### Check These Files Line-by-Line:

1. **common/common.scss** - Should be 268 lines
2. **ame-hero.hbs** - Should be 42 lines
3. **ame-banner.js** - Should be 44 lines

### Verify Color Scheme:
```
Admin → Customize → Colors
- Primary: ECEFF1
- Secondary: 263238
- Tertiary: 003d6b  (THIS IS THE BLUE BORDER COLOR)
- Quaternary: 0078d4
```

### Check Theme Components:
```
Admin → Customize → Themes → [Your Theme]
- Should show: "Components: None" or list any components
- Make sure no conflicting components are active
```

---

## Emergency Reset

If all else fails:

1. **Export current theme** (backup)
2. **Create brand new theme**
3. **Upload files fresh**
4. **Apply color scheme**
5. **Set as default**
6. **Rebuild**
7. **Test on /categories page**

---

## Success Indicators

You'll know it's working when you see:

✅ Large uppercase quote above panel (rotates every 5.5s)
✅ Dark translucent glass panel
✅ Four tabs: subcategories | tags | Latest | Top
✅ Four cards in 2x2 grid with blue left borders
✅ Each card has bold title + gray subtitle
✅ NO "Welcome back, admin!" message
✅ NO default category list below
✅ NO search box in panel

---

## Get Help

Post to Discourse Meta with:
1. Screenshots (before/after)
2. Browser console errors (F12 → Console tab)
3. Theme file checksums
4. Discourse version

---

**Last Updated**: October 8, 2025
