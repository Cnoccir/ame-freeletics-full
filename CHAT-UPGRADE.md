# Chat Widget Upgrade - Deployment Guide

## What Was Fixed

### N8N Workflow (`Agentic RAG - Fixed & Enhanced.json`)
- ✅ **Added proper tool names and descriptions** for all 4 tools (list_documents, fetch_document_hierarchy, expand_context, vector_search)
- ✅ **Configured session-based memory** (10 messages per user/IP)
- ✅ **Enhanced response extraction** to capture images and citations from tool calls
- ✅ **Updated webhook response format** with structured data: `{reply, citations, images, hasImages, hasCitations}`

### Chat Widget Improvements
- ✅ **Enhanced markdown parsing**: Headers (H1-H3), bold, italic, lists, code blocks
- ✅ **Image lightbox**: Click images to view full-size with blur backdrop
- ✅ **Better citations display**: Improved formatting with emoji icons and section paths
- ✅ **Improved styling**: Better spacing, colors, and hover effects
- ✅ **Mobile responsive**: Works on all screen sizes

---

## Deployment Steps

### 1. Update N8N Workflow

1. Open your n8n instance
2. Go to Workflows
3. Find "Agentic RAG" workflow (or create new)
4. Click **Import from File**
5. Select `Agentic RAG - Fixed & Enhanced.json`
6. Activate the workflow
7. Copy the webhook URL from the "Webhook" node

### 2. Update Discourse Theme Settings

1. Go to Discourse Admin → Customize → Themes
2. Find "AME Freeletics Full" theme
3. Click **Edit CSS/HTML**
4. Go to **Settings** tab
5. Update `webhook_url` with your n8n webhook URL:
   ```
   https://your-n8n-instance.com/webhook/rag-chat
   ```

### 3. Deploy Theme Updates

**Option A: Direct Upload (Recommended)**
1. Zip the entire theme folder:
   ```powershell
   Compress-Archive -Path * -DestinationPath ame-freeletics-full.zip
   ```
2. In Discourse Admin → Customize → Themes
3. Click your theme → **Edit CSS/HTML** → **Theme** tab
4. Upload the new JavaScript and CSS files

**Option B: Git Sync (If using Git repository)**
1. Commit changes:
   ```bash
   git add .
   git commit -m "Enhanced chat widget with markdown, images, citations"
   git push
   ```
2. In Discourse: Theme → **Check for Updates**

---

## Testing the Upgrade

### Test 1: Tool Functionality
Ask: **"What documents do you have?"**
- Expected: Agent calls `list_documents` tool and shows formatted list

### Test 2: Vector Search with Citations
Ask: **"How do I configure authentication?"**
- Expected: Calls `vector_search`, returns answer with citations showing section paths

### Test 3: Image Rendering
Ask about any topic that has diagrams in your docs
- Expected: Images appear in grid below response
- Click image → opens lightbox overlay
- ESC or click backdrop → closes lightbox

### Test 4: Markdown Formatting
Ask: **"Explain the configuration in detail"**
- Expected response with:
  - Headers (`## Section Name`)
  - Bold text (`**important**`)
  - Bullet lists (`- item`)
  - Code blocks (```)

### Test 5: Session Memory
1. Ask: "What's the difference between X and Y?"
2. Then ask: "Can you elaborate on the first point?"
- Expected: Agent remembers context from first message

---

## How It Works

### Response Flow
```
User Query → n8n Webhook → Rate Limit Check → OpenAI Agent
    ↓
Agent uses tools:
- list_documents (when asked about available docs)
- vector_search (searches knowledge base)
- fetch_document_hierarchy (gets doc structure)
- expand_context (gets full content for sections)
    ↓
Response → Extract images & citations → Format markdown → Display in chat
```

### Webhook Response Format
```json
{
  "reply": "Markdown-formatted answer text",
  "citations": [
    {
      "doc_id": "doc_abc",
      "section_path": "Chapter 2 / Configuration",
      "chunk_id": "chunk_123"
    }
  ],
  "images": [
    "https://storage.example.com/diagram1.png",
    "https://storage.example.com/diagram2.png"
  ],
  "hasImages": true,
  "hasCitations": true
}
```

---

## Customization

### Change Chat Widget Colors
Edit `settings.yaml`:
```yaml
chat_brand_accent:
  default: "#0277BD"  # Your brand color
```

### Modify Agent Behavior
In n8n workflow, edit "OpenAI Agent" node → `systemMessage`:
```
You are a helpful AI assistant...
[Modify instructions here]
```

### Adjust Rate Limits
In n8n workflow, "Check Rate Limit" node:
```json
{
  "p_user_limit": 50,   // Requests per user per hour
  "p_ip_limit": 100,    // Requests per IP per hour
  "p_window_minutes": 60
}
```

### Disable Chat on Mobile
Edit `settings.yaml`:
```yaml
enable_chat_on_mobile:
  default: false
```

---

## Troubleshooting

### Issue: Tools not being called
**Cause:** Tool descriptions missing or agent not understanding when to use them
**Fix:** Check n8n workflow → ensure all tool nodes have `name` and `description` parameters filled

### Issue: Images not displaying
**Cause:** Image URLs not in response or CORS issues
**Fix:**
1. Check n8n workflow → "Debug Agent Output" node logs
2. Verify Supabase storage bucket is public
3. Check browser console for errors

### Issue: Citations empty
**Cause:** Agent intermediate steps not being captured
**Fix:** Verify "Debug Agent Output" node is extracting from `intermediateSteps` array

### Issue: Memory not working
**Cause:** Session key not configured properly
**Fix:** Check "Simple Memory" node has: `sessionKey: "={{ $json.context.userId || $json.context.userIp }}"`

### Issue: Markdown not rendering
**Cause:** Old JavaScript version cached
**Fix:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Check Discourse theme is activated

---

## File Changes Summary

### Modified Files:
- `javascripts/discourse/initializers/ame-chat.js.es6` - Enhanced markdown, lightbox, citations
- `common/common.scss` - Image grid, lightbox, markdown styling
- `Agentic RAG - Fixed & Enhanced.json` - Tool configs, memory, response format

### No Changes Needed:
- `common/head_tag.html` - Widget HTML structure unchanged
- `settings.yaml` - Existing settings work (just update webhook_url)
- `about.json` - Theme metadata unchanged

---

## Next Steps

1. **Monitor Usage**: Check Supabase `query_logs` table for analytics
2. **Fine-tune System Prompt**: Adjust agent behavior based on user feedback
3. **Add More Tools**: Create additional tools for specialized functions
4. **Implement Feedback**: Add thumbs up/down buttons for responses
5. **Analytics Dashboard**: Build admin view of chat usage stats

---

## Support

If you encounter issues:
1. Check n8n workflow execution logs (n8n UI → Executions)
2. Check browser console for JavaScript errors (F12)
3. Verify webhook URL is correct in theme settings
4. Test webhook directly with curl:

```bash
curl -X POST https://your-n8n-url.com/webhook/rag-chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What documents are available?",
    "userId": "test",
    "username": "test"
  }'
```

Expected: JSON response with `reply`, `citations`, `images` fields.
