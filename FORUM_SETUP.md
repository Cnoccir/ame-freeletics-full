# AME TechAssist Forum Structure Setup

This document explains the bullet-proof forum structure for AME-TECHASSIST and how to deploy it.

## Overview

The forum is organized around **four master topics** that serve as the foundation for all content:

1. **0. Assistance** - Active troubleshooting and questions
2. **1. Insights** - Field observations and lessons learned  
3. **2. Guides** - Educational hub for standard procedures
4. **3. Resources** - Read-only library for official documentation

The homepage hero cards (1-3) link directly to these master topics. The 4th card remains for the AI Assistant (AME-Bot).

## Directory Structure

```
ame-freeletics-full/
├── config/
│   └── forum_topics.json          # Topic configuration (IDs stored here)
├── content/
│   ├── topics/
│   │   ├── assistance.md          # Assistance topic content
│   │   ├── insights.md            # Insights topic content
│   │   ├── guides.md              # Guides topic content
│   │   └── resources.md           # Resources topic content
│   └── welcome.md                 # Welcome/Start Here topic
├── scripts/
│   └── sync_forum_structure.mjs   # Discourse API sync script
├── settings.yaml                  # Theme settings (hero cards)
└── package.json                   # Node.js configuration
```

## Prerequisites

1. **Node.js** version 18 or higher
2. **Discourse API access**:
   - Admin account on your Discourse instance
   - API key generated from Admin → API → New API Key
3. **Environment variables** set (see below)

## Setup Instructions

### Step 1: Set Environment Variables

You need three environment variables to run the sync script:

**On macOS/Linux:**
```bash
export DISCOURSE_BASE_URL="https://support.ame-techassist.com"
export DISCOURSE_API_KEY="your_api_key_here"
export DISCOURSE_API_USER="admin_username"
```

**On Windows PowerShell:**
```powershell
$env:DISCOURSE_BASE_URL="https://support.ame-techassist.com"
$env:DISCOURSE_API_KEY="your_api_key_here"
$env:DISCOURSE_API_USER="admin_username"
```

**On Windows CMD:**
```cmd
set DISCOURSE_BASE_URL=https://support.ame-techassist.com
set DISCOURSE_API_KEY=your_api_key_here
set DISCOURSE_API_USER=admin_username
```

**Best Practice:** Create a `.env` file (not tracked in git) and load it:
```bash
# .env file
DISCOURSE_BASE_URL=https://support.ame-techassist.com
DISCOURSE_API_KEY=your_api_key_here
DISCOURSE_API_USER=admin_username
```

Then load it before running the script:
```bash
# On Unix/Mac with direnv or source
source .env

# Or on Windows, load manually
```

### Step 2: Run the Sync Script

**First-time setup** (creates all topics and welcome post):
```bash
npm run sync-forum-with-welcome
```

**Update existing topics** (if you edit markdown files):
```bash
npm run sync-forum
```

### Step 3: Deploy Theme to Discourse

After running the sync script, the `settings.yaml` file will be updated with the correct topic links.

1. **Zip the theme** (from the repo root):
   ```bash
   # Exclude unnecessary files
   zip -r ame-freeletics-full.zip . -x "*.git*" -x "node_modules/*" -x "*.env"
   ```

2. **Upload to Discourse**:
   - Go to: Admin → Customize → Themes
   - Click "Install" → "From your device"
   - Upload the ZIP file
   - Activate the theme

3. **Verify hero cards**:
   - Visit your homepage
   - Ensure cards 1-3 link to the correct master topics
   - Ensure card 4 (AI Assistant) still works

## What the Sync Script Does

1. **Loads** `config/forum_topics.json` to get current state
2. **For each topic**:
   - If `topic_id` is null: Creates a new topic via Discourse API
   - If `topic_id` exists: Updates the first post with new content
3. **Updates** `config/forum_topics.json` with topic IDs (if any were created)
4. **Updates** `settings.yaml` hero card settings:
   - `hero_card_1_*` → Assistance
   - `hero_card_2_*` → Insights
   - `hero_card_3_*` → Guides
   - `hero_card_4_*` → AI Assistant (preserved, labels updated)
5. **Optionally creates** the Welcome topic (with `--with-welcome` flag)

## Editing Topic Content

To update the master topic descriptions:

1. Edit the markdown files in `content/topics/`
2. Run `npm run sync-forum`
3. Re-deploy the theme (no ZIP needed if only content changed)

The sync script will update the first post of each topic automatically.

## Hero Card Configuration

The hero cards are configured in `settings.yaml`:

```yaml
hero_card_1_label:
  default: "0. Assistance"
hero_card_1_subtitle:
  default: "Get live help on real issues"
hero_card_1_url:
  default: "/t/123"  # Auto-updated by sync script

# ... cards 2-3 similar ...

hero_card_4_label:
  default: "AI Assistant (AME-Bot)"
hero_card_4_subtitle:
  default: "Chat with our knowledge base"
hero_card_4_url:
  default: "/search?q=category%3Aai-assistant"  # Preserved
```

**DO NOT manually edit these settings** unless you know what you're doing. The sync script manages them automatically.

## AI Assistant (Card 4)

The 4th hero card is **intentionally preserved** for the AI Assistant. The sync script will:
- Update the label to "AI Assistant (AME-Bot)"
- Update the subtitle to "Chat with our knowledge base"
- **NOT change the URL** (keeps existing configuration)

You can manually update `hero_card_4_url` in `settings.yaml` to point to your n8n webhook endpoint when ready.

## Troubleshooting

### Script fails with "Missing required environment variables"

**Solution:** Ensure all three environment variables are set:
- `DISCOURSE_BASE_URL`
- `DISCOURSE_API_KEY`
- `DISCOURSE_API_USER`

### Script fails with "HTTP 403" or "HTTP 401"

**Solution:** Check your API key and username:
1. Go to Admin → API → Your Key
2. Ensure the key has "All Users" scope or specific user scope
3. Ensure `DISCOURSE_API_USER` matches the username associated with the key

### Script fails with "HTTP 404"

**Solution:** Your `DISCOURSE_BASE_URL` is incorrect. Ensure:
- No trailing slash: ✅ `https://support.ame-techassist.com` ✗ `https://support.ame-techassist.com/`
- Correct protocol (http vs https)
- Domain is correct

### Topics created but hero cards don't update

**Solution:** 
1. Check `settings.yaml` was updated by the script
2. Re-deploy the theme to Discourse
3. Clear browser cache and refresh

### Want to reset everything?

**Solution:**
1. Manually delete the topics from Discourse
2. Edit `config/forum_topics.json` and set all `topic_id` values to `null`
3. Run `npm run sync-forum-with-welcome` again

## Maintenance

### Adding a New Master Topic

1. Add entry to `config/forum_topics.json`:
   ```json
   {
     "key": "newtopic",
     "title": "4. New Topic",
     "topic_id": null,
     "instructions_file": "content/topics/newtopic.md",
     "hero_card_slot": null
   }
   ```

2. Create `content/topics/newtopic.md` with content

3. Run `npm run sync-forum`

### Changing Topic Descriptions

1. Edit the markdown file in `content/topics/`
2. Run `npm run sync-forum`
3. No need to redeploy theme (content is updated via API)

### Updating Welcome Topic

1. Edit `content/welcome.md`
2. Manually update the topic on Discourse, OR
3. Delete the topic and run `npm run sync-forum-with-welcome` to recreate it

## Security Notes

⚠️ **NEVER commit secrets to git**

- Add `.env` to `.gitignore`
- Never hardcode `DISCOURSE_API_KEY` in files
- Use environment variables for all sensitive data
- Rotate API keys periodically

## Quick Reference

```bash
# First-time setup
npm run sync-forum-with-welcome

# Update topics after editing markdown
npm run sync-forum

# Check what would change (dry-run - not implemented yet)
# npm run sync-forum -- --dry-run

# View current configuration
cat config/forum_topics.json
```

## Support

For issues with the forum structure:
1. Check this document first
2. Review `config/forum_topics.json` for topic IDs
3. Check Discourse admin logs
4. Contact your Discourse administrator

---

**Last Updated:** 2025-11-28  
**Version:** 1.0.0
