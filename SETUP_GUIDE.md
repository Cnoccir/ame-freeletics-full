# AME TechAssist Forum - Setup Guide

## Overview

This theme implements a 4-pillar forum structure with hero cards linking to master topics.

## Quick Setup (3 Steps)

### Step 1: Create Master Topics in Discourse

Manually create these 4 topics in your Discourse forum:

#### Topic 1: "0. Assistance"
```markdown
# 0. Assistance

**Description:** The place for active troubleshooting and questions. Post here if you are currently stuck, need a second opinion, or are looking for information that isn't in the guides.

**What belongs here:**
- "Has anyone seen this error code?"
- "I need help identifying this part."
- "How do I approach this unique site constraint?"

**Notes:**
- Once a solution is verified, these threads may be moved to the **Insights** section so others can learn from them.
```

#### Topic 2: "1. Insights"
```markdown
# 1. Insights

**Description:** A collection of field observations and lessons learned. Post here to share solved issues, unique anomalies found on-site, or clever workarounds that others should know about.

**What belongs here:**
- "Fix for the vibrating pump issue."
- "Photos of a unique wiring setup at [Site Name]."
- "Workaround for the software glitch in version 2.0."

**Notes:**
- This is the place to document what actually worked in the field so others can reuse proven solutions.
```

#### Topic 3: "2. Guides"
```markdown
# 2. Guides

**Description:** The educational hub for standard procedures. Look here for step-by-step tutorials, company-specific configurations, and best practices for executing tasks.

**What belongs here:**
- "How to calibrate the new sensors."
- "Standard setup for the north-side units."
- "Checklist for end-of-day protocols."

**Notes:**
- Guides should be written so a newer tech could follow them end-to-end without guessing.
```

#### Topic 4: "3. Resources"
```markdown
# 3. Resources

**Description:** A read-only library for official documentation. This section houses verified data from manufacturers and external standards organizations.

**What belongs here:**
- Manufacturer PDF manuals.
- Spec sheets.
- Code compliance documents.
- Firmware download links.

**Notes:**
- Threads here should be curated and organized. Use clear titles and tags so docs are easy to find.
```

#### Topic 5: "Welcome to AME TechAssist - Start Here" (Optional)
```markdown
# Welcome to AME TechAssist

This forum is our internal hub for sharing knowledge, solving problems, and documenting what actually works in the field.

Everything here rolls up into four main areas:

## 0. Assistance
When you're stuck right now, this is where you ask for help. Post your screenshots, error codes, field notes, and what you've tried so far. Once we confirm a solution, we'll move the thread into **Insights** so others can benefit.

## 1. Insights
This is our library of field-proven fixes and lessons learned. If you solved something interesting or found a clever workaround, document it here so the next tech doesn't have to re-solve the same problem.

## 2. Guides
This is where we keep step-by-step walkthroughs and standard procedures. Think "playbooks" for common tasks and setups — written so anyone on the team can follow them start to finish.

## 3. Resources
A read-only shelf for official documentation: manufacturer manuals, spec sheets, code references, and firmware downloads. If you need a data sheet or official guidance, look here first.

---

## Quick Reference

Use this quick routing flow when you're not sure where to post:

- **Stuck right now?** → Post in **Assistance**.
- **Found a fix / something cool?** → Post in **Insights**.
- **Teaching a skill or process?** → Post in **Guides**.
- **Need a manual or spec?** → Search in **Resources**.

---

## AI Assistant (AME-Bot)

We also have an **AI Assistant (AME-Bot)** that will be connected to our AME knowledge base through an n8n-powered workflow. The goal is to let you:

- Ask quick "how do I…" questions.
- Pull up relevant guides and resources.
- Get starting points for troubleshooting.

For now, use the **AI Assistant** card on the homepage to try it out. As we improve it, we'll keep this topic updated with tips and examples.

Thanks for helping build this into a living playbook for the whole team.
```

**Note the Topic ID** from each URL:
- Assistance: `/t/assistance/123` → ID is **123**
- Insights: `/t/insights/124` → ID is **124**
- Guides: `/t/guides/125` → ID is **125**
- Resources: `/t/resources/126` → ID is **126**
- Welcome: `/t/welcome-to-ame-techassist/127` → ID is **127**

### Step 2: Update Theme Settings in Discourse Admin

After pushing this theme to GitHub and Discourse pulls it:

1. Go to: **Admin → Customize → Themes → AME Freeletics Full**
2. Click **Settings** or **Edit CSS/HTML → Settings**
3. Update the hero card URLs with your topic IDs:

```yaml
hero_card_1_url: /t/123   # Replace 123 with your Assistance topic ID
hero_card_2_url: /t/124   # Replace 124 with your Insights topic ID
hero_card_3_url: /t/125   # Replace 125 with your Guides topic ID
# hero_card_4_url stays as is (AI Assistant)
```

4. Save changes

### Step 3: Verify

1. Visit your forum homepage
2. Check that hero cards 1-3 link to the correct topics
3. Check that hero card 4 (AI Assistant) still works

## How the GitHub Workflow Works

```
1. You edit files locally (settings.yaml, styles, etc.)
   ↓
2. Push to GitHub repo
   ↓
3. Discourse automatically pulls changes from GitHub
   ↓
4. Theme updates live on your forum
```

**That's it!** No scripts needed.

## Maintaining Topics

### To Update Topic Content

1. Go to the topic in Discourse
2. Edit the first post
3. Update the content
4. Save

**Or** if you want version control:

1. Keep the markdown in `content/topics/` folder (for reference)
2. Copy/paste to Discourse when you make changes
3. Commit the markdown to git for history

### To Rearrange/Reorganize Topics

Discourse has built-in tools:

- **Move posts**: Select posts → wrench icon → Move to New Topic
- **Merge topics**: In topic → wrench → Merge Topics
- **Close/Archive**: In topic → wrench → Close/Archive
- **Pin**: In topic → wrench → Pin Globally or Pin in Category

### To Change Hero Card Links

**Option A: Via Discourse Admin UI** (Recommended)
1. Admin → Customize → Themes → Settings
2. Update `hero_card_X_url` values
3. Changes take effect immediately

**Option B: Via GitHub** (Permanent)
1. Edit `settings.yaml` in this repo
2. Update the `default:` values
3. Push to GitHub
4. Discourse will pull and apply

## File Structure

```
ame-freeletics-full/
├── settings.yaml              # Theme settings (edit here)
├── about.json                 # Theme metadata
├── common/                    # Styles that apply everywhere
├── desktop/                   # Desktop-specific styles
├── mobile/                    # Mobile-specific styles
├── javascripts/discourse/     # Theme JavaScript
│   ├── components/            # Ember components
│   ├── connectors/            # Plugin outlets
│   └── initializers/          # App initializers
└── content/                   # Reference content (not deployed)
    ├── topics/                # Topic templates (copy/paste to Discourse)
    └── welcome.md             # Welcome topic template
```

**Note:** The `content/`, `config/`, and `scripts/` folders are **NOT part of the deployed theme**. They're just reference material for you.

## Troubleshooting

### Hero cards don't link correctly
- Check the topic IDs in Admin → Settings
- Make sure URLs are `/t/123` format (not `/t/topic-slug/123`)

### Changes don't appear after pushing to GitHub
- Check Admin → Customize → Themes → Remote Themes
- Click "Check for Updates" or "Update"
- Wait a few seconds and refresh

### Want to reset a topic's content
- Edit the topic in Discourse
- Copy/paste from `content/topics/{topic}.md`
- Save

## Best Practices

1. **Use the Discourse UI** for day-to-day content changes
2. **Use GitHub** for theme styling, settings, and structural changes
3. **Keep `content/topics/` updated** as a backup/reference
4. **Pin the Welcome topic** for new users
5. **Use tags** to organize content within each pillar

## Quick Reference

| Pillar | Purpose | Hero Card |
|--------|---------|-----------|
| 0. Assistance | Active troubleshooting | Card 1 |
| 1. Insights | Field lessons learned | Card 2 |
| 2. Guides | Standard procedures | Card 3 |
| 3. Resources | Official documentation | _(via navigation)_ |
| AI Assistant | AME-Bot chat | Card 4 |

**Decision Tree:**
- Stuck now? → Assistance
- Solved something? → Insights  
- Teaching a process? → Guides
- Sharing official docs? → Resources
- Quick question? → AI Assistant

---

**Version:** 0.2.0  
**Last Updated:** 2025-11-28
