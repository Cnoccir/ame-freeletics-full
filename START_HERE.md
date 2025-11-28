# 👋 Start Here

## Quick Links

- **Setting up the forum structure?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **What was implemented?** → [WHAT_WAS_IMPLEMENTED.md](WHAT_WAS_IMPLEMENTED.md)
- **Need a quick reference?** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

## The 3-Step Setup

### 1. Push to GitHub
```bash
git add .
git commit -m "Add 4-pillar forum structure"
git push
```

### 2. Sync in Discourse
- Admin → Customize → Themes → Remote Themes
- Click "Check for Updates"

### 3. Create Topics & Link Hero Cards
- Create 4 topics in Discourse (copy from `content/topics/`)
- Note topic IDs from URLs
- Update `hero_card_X_url` in Admin → Settings

**Full instructions:** [SETUP_GUIDE.md](SETUP_GUIDE.md)

## What This Theme Does

- ✅ **4-pillar forum structure** (Assistance, Insights, Guides, Resources)
- ✅ **Hero cards** link to master topics
- ✅ **AI Assistant** preserved on card 4
- ✅ **GitHub workflow** - push changes, Discourse pulls
- ✅ **Topic templates** ready to copy/paste

## File Overview

| File/Folder | Purpose |
|-------------|---------|
| `settings.yaml` | Theme settings (hero cards) |
| `content/topics/` | Topic templates to copy/paste |
| `SETUP_GUIDE.md` | **Read this first!** |
| `QUICK_REFERENCE.md` | Share with users |
| `scripts/` | Optional automation tool |

## Common Tasks

**Update hero card links:**
- Admin → Customize → Themes → Settings → `hero_card_X_url`

**Edit topic content:**
- Go to topic in Discourse → Edit first post

**Change theme styles:**
- Edit files here → Push to GitHub → Discourse pulls

**Rearrange topic posts:**
- Use wrench icon in Discourse UI

---

**Need help?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.
