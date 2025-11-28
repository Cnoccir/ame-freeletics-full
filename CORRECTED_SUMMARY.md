# Corrected Implementation - 5 Hero Cards

## You Were Right! ✅

The forum has **5 HERO CARDS**, not 4:

1. **Card 1: 0. Assistance** - Active troubleshooting
2. **Card 2: 1. Insights** - Field lessons learned
3. **Card 3: 2. Guides** - Step-by-step procedures
4. **Card 4: 3. Resources** - Official documentation
5. **Card 5: AI Assistant (AME-Bot)** - AI chat

## Topics to Create

You need to create **5 topics** in Discourse:

1. **"0. Assistance"** - Copy from `content/topics/assistance.md`
2. **"1. Insights"** - Copy from `content/topics/insights.md`
3. **"2. Guides"** - Copy from `content/topics/guides.md`
4. **"3. Resources"** - Copy from `content/topics/resources.md`
5. **"Welcome to AME TechAssist"** (optional) - Copy from `content/welcome.md`

## What I Fixed

### ✅ Updated `settings.yaml`
- Added `hero_card_5_*` settings for AI Assistant
- Moved AI Assistant from card 4 → card 5
- Set card 4 for Resources

### ✅ Updated Hero Template
- Added 5th card to `ame-hero-connector.hbs`
- All 4 master topics now have hero cards
- AI Assistant is on card 5 (kept as button trigger)

### ✅ Updated Config
- `config/forum_topics.json` now shows Resources on hero_card_slot: 4

## Setup Steps (Corrected)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add 5-card hero structure with all 4 pillars"
git push
```

### 2. Sync in Discourse
- Admin → Customize → Themes → Check for Updates

### 3. Create 4 Master Topics
Create these in Discourse (copy/paste from `content/topics/`):
- 0. Assistance → note topic ID (e.g., 101)
- 1. Insights → note topic ID (e.g., 102)
- 2. Guides → note topic ID (e.g., 103)
- 3. Resources → note topic ID (e.g., 104)

### 4. Update Hero Card URLs
Go to Admin → Customize → Themes → Settings:
```
hero_card_1_url: /t/101  (Assistance)
hero_card_2_url: /t/102  (Insights)
hero_card_3_url: /t/103  (Guides)
hero_card_4_url: /t/104  (Resources)  ← THIS WAS MISSING!
hero_card_5_url: (keep as-is for AI Assistant)
```

### 5. Optionally Create Welcome Topic
- Create "Welcome to AME TechAssist" topic
- Pin it globally or link from navigation

## What's Different Now

**BEFORE (Wrong):**
- ❌ Only 4 cards configured
- ❌ Resources had no hero card
- ❌ AI Assistant was on card 4

**AFTER (Correct):**
- ✅ 5 cards configured
- ✅ All 4 master topics have hero cards (1-4)
- ✅ AI Assistant is on card 5

## File Summary

**What changed:**
- `settings.yaml` - Added hero_card_5, reassigned card 4 to Resources
- `javascripts/discourse/connectors/before-list-area/ame-hero-connector.hbs` - Added 5th card
- `config/forum_topics.json` - Resources now has hero_card_slot: 4

**Topic templates (ready to use):**
- `content/topics/assistance.md` ✅
- `content/topics/insights.md` ✅
- `content/topics/guides.md` ✅
- `content/topics/resources.md` ✅
- `content/welcome.md` ✅

## Quick Verification

After setup, your homepage should show:

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 0.          │ 1.          │ 2.          │ 3.          │ AI          │
│ Assistance  │ Insights    │ Guides      │ Resources   │ Assistant   │
│             │             │             │             │ (AME-Bot)   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

All 5 cards should be visible and functional!

---

**Thank you for catching this!** The structure is now correct.
