# Quick Start: Implementing Freeletics Theme

This guide will get you up and running with a Freeletics-inspired Discourse theme in ~30 minutes.

## Prerequisites
- Admin access to your Discourse instance
- Access to upload files (fonts) to a CDN or your server

---

## Step 1: Create Base Theme (5 min)

1. Go to **Admin** → **Customize** → **Themes**
2. Click **Install** → **Create New**
3. Name it: "Freeletics Dark Theme"
4. Click **Create**

---

## Step 2: Apply Dark Color Scheme (5 min)

1. In your new theme, go to **Colors** tab
2. Click **Add a color scheme** → Select **Dark** or create new scheme
3. Edit the following colors:

```
Primary: #ECEFF1
Secondary: #263238
Tertiary: #0277BD
Quaternary: #0277BD
Header Background: #263238
Header Primary: #ECEFF1
Highlight: #FFB36B
Danger: #FF3333
Success: #00A1A1
```

4. Click **Save**

---

## Step 3: Add Custom Fonts (10 min)

### Option A: Use Aktiv Grotesk (if you have license)
1. Upload the 4 font files from `data/freeletics/assets/` to your CDN
2. In theme, go to **Common** → **CSS** tab
3. Add:

```css
@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('YOUR_CDN_URL/aktivgrotesk-rg.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('YOUR_CDN_URL/aktivgrotesk-md.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('YOUR_CDN_URL/aktivgrotesk-bd.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

:root {
  --font-family: 'Aktiv Grotesk', Arial, sans-serif;
  --heading-font-family: 'Aktiv Grotesk', Arial, sans-serif;
}
```

### Option B: Use Similar Free Font
Use **Inter** or **Work Sans** as alternatives:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

:root {
  --font-family: 'Inter', Arial, sans-serif;
  --heading-font-family: 'Inter', Arial, sans-serif;
}
```

---

## Step 4: Add Custom Shadows (2 min)

Add to **Common** → **CSS**:

```css
:root {
  --shadow-modal: 0 8px 60px rgba(0, 0, 0, 1);
  --shadow-composer: 0 -1px 40px rgba(0, 0, 0, 0.35);
  --shadow-card: 0 4px 14px rgba(0, 0, 0, 0.5);
  --shadow-dropdown: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
}
```

---

## Step 5: Install Key Plugins (5-10 min)

Go to **Admin** → **Plugins** and install:

### Essential (Free)
- ✅ **discourse-solved** - Mark solutions
- ✅ **discourse-details** - Spoiler/collapse boxes
- ✅ **discourse-reactions** - Custom emoji reactions

### Optional (Premium/Paid)
- **discourse-gamification** - Points & leaderboards
- **discourse-topic-voting** - Feature voting
- **discourse-ai** - AI features

---

## Step 6: Test Your Theme (3 min)

1. Click **Preview** in theme editor
2. Check:
   - Text is readable (light on dark)
   - Links are blue (`#0277BD`)
   - Buttons have proper contrast
   - Mobile view looks good

---

## Step 7: Make Theme Default (1 min)

1. Go back to **Themes** list
2. Click **Set as default** on your new theme
3. Done! 🎉

---

## Optional: Add Featured Topics

If you want the homepage featured topics component:

1. Create new **Theme Component**
2. Name: "Featured Topics"
3. Copy CSS from `data/freeletics/assets/common_theme_3_*.css`
4. Attach component to your main theme
5. Create `featured` tag in **Tags** settings
6. Tag topics you want featured

---

## Troubleshooting

### Fonts not loading?
- Check CDN URL is accessible
- Verify CORS headers allow font loading
- Check browser console for errors

### Colors look wrong?
- Make sure you saved the color scheme
- Ensure theme is using the right color scheme
- Hard refresh browser (Ctrl+F5)

### Mobile looks broken?
- Check responsive CSS is included
- Test in actual mobile browser, not just DevTools
- Verify no custom CSS is overriding responsive rules

---

## Need More Help?

1. **Review full analysis:** See `THEME_ANALYSIS.md`
2. **Check CSS files:** Browse `data/freeletics/assets/`
3. **Discourse Meta:** https://meta.discourse.org
4. **Theme Dev Guide:** https://meta.discourse.org/t/93648

---

## Summary of What You Get

✅ Dark theme matching Freeletics  
✅ Custom typography (Aktiv Grotesk or similar)  
✅ Blue accent colors (`#0277BD`)  
✅ Orange highlights (`#FFB36B`)  
✅ Proper shadows and depth  
✅ Mobile-optimized layout  
✅ Plugin ecosystem (optional)  

**Total time:** ~30-40 minutes

---

**Pro Tip:** Start with this minimal setup, then gradually add plugins and components as needed. Don't try to install everything at once!
