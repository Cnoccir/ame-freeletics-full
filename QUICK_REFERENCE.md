# AME TechAssist Forum - Quick Reference Card

## The Four Pillars

| # | Topic | Purpose | Hero Card |
|---|-------|---------|-----------|
| 0 | **Assistance** | Active troubleshooting & questions | Card 1 |
| 1 | **Insights** | Field-proven fixes & lessons learned | Card 2 |
| 2 | **Guides** | Step-by-step procedures & tutorials | Card 3 |
| 3 | **Resources** | Official docs, manuals, spec sheets | _(via navigation)_ |

**AI Assistant (AME-Bot)** → Hero Card 4 _(preserved, wired to n8n)_

---

## Quick Decision Tree

**"Where should I post?"**

```
Are you stuck RIGHT NOW?
├─ YES → 🆘 Assistance
└─ NO ↓

Did you SOLVE something interesting?
├─ YES → 💡 Insights
└─ NO ↓

Are you TEACHING a procedure?
├─ YES → 📚 Guides
└─ NO ↓

Are you SHARING official documentation?
├─ YES → 📁 Resources
└─ NO → Ask in Assistance or use AI Assistant
```

---

## Command Cheat Sheet

```bash
# Initial setup (creates topics + welcome)
npm run sync-forum-with-welcome

# Update topic content after editing markdown
npm run sync-forum

# View current configuration
cat config/forum_topics.json

# Set environment variables (Windows PowerShell)
$env:DISCOURSE_BASE_URL="https://support.ame-techassist.com"
$env:DISCOURSE_API_KEY="your_key"
$env:DISCOURSE_API_USER="admin"

# Set environment variables (macOS/Linux)
export DISCOURSE_BASE_URL="https://support.ame-techassist.com"
export DISCOURSE_API_KEY="your_key"
export DISCOURSE_API_USER="admin"
```

---

## File Structure at a Glance

```
config/
  forum_topics.json        ← Topic IDs stored here

content/topics/
  assistance.md            ← Edit these to update topic content
  insights.md
  guides.md
  resources.md

content/
  welcome.md               ← Welcome/Start Here topic

scripts/
  sync_forum_structure.mjs ← Run this to sync changes

settings.yaml              ← Hero card links (auto-updated by script)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing environment variables" | Set `DISCOURSE_BASE_URL`, `DISCOURSE_API_KEY`, `DISCOURSE_API_USER` |
| "HTTP 403/401" | Check API key and username are correct |
| "HTTP 404" | Verify `DISCOURSE_BASE_URL` (no trailing slash) |
| Hero cards don't update | Re-deploy theme ZIP to Discourse |
| Want to reset | Delete topics manually, set `topic_id` to `null` in config, re-run script |

---

## Maintenance Workflows

### Updating a Topic Description
1. Edit `content/topics/{topic}.md`
2. Run `npm run sync-forum`
3. Done (no theme redeployment needed)

### Adding a New Master Topic
1. Add entry to `config/forum_topics.json`
2. Create `content/topics/{newtopic}.md`
3. Run `npm run sync-forum`
4. Optionally link from hero card or navigation

### Changing Hero Card Links
The sync script manages this automatically. To manually override:
1. Edit `settings.yaml` (hero_card_X_url)
2. Re-deploy theme ZIP

---

**📖 Full Documentation:** [FORUM_SETUP.md](FORUM_SETUP.md)
