// Initializes after Discourse boot, uses theme settings for config, and renders a richer chat UI.
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "ame-chat-widget",
  initialize() {
    withPluginApi("1.8.0", api => {
      const settingsSvc = api.container.lookup("service:theme-settings");
      const settings = settingsSvc?.themeSettings || {};
      const widgetEl = document.getElementById("ame-chat-widget");
      const ds = widgetEl?.dataset || {};

      const DEFAULT_WEBHOOK = "https://rnocciolo.app.n8n.cloud/webhook/rag-chat";

      // Prefer absolute URLs and ignore unresolved template strings
      const pickUrl = (v) => {
        if (!v) return null;
        const s = String(v).trim();
        if (!s || s.includes("{{")) return null;
        return /^https?:\/\//i.test(s) ? s : null;
      };

      const webhook = pickUrl(settings.webhook_url) || pickUrl(ds.webhook) || DEFAULT_WEBHOOK;
      const bearerFromSettings = settings.bearer_token;

      // If no webhook URL, we'll still allow the UI to open but sending will show a configuration message.
      const webhookMissing = !webhook;

      // Handle mobile display based on settings
      if (!settings.enable_chat_on_mobile) {
        const isMobile = window.matchMedia("(max-width: 680px)").matches;
        if (isMobile) {
          const widget = document.getElementById("ame-chat-widget");
          if (widget) widget.style.display = "none";
          // Still define openAMEChat so the trigger doesn't error, but it will no-op
        }
      }

      const state = {
        sending: false,
        messages: [],
        abort: null,
        // Persist by route + user id so multiple pages keep separate histories per user
        key: `ame_chat_${api.getCurrentUser()?.id || 'anon'}_${window.location.pathname}`
      };

      const el = {
        widget: document.getElementById("ame-chat-widget"),
        close:  document.getElementById("ame-chat-close"),
        clear:  document.getElementById("ame-chat-clear"),
        area:   document.getElementById("ame-chat-textarea"),
        send:   document.getElementById("ame-chat-send"),
        feed:   document.getElementById("ame-chat-messages"),
        title:  document.getElementById("ame-chat-title")
      };

      // Accessibility improvements
      el.feed?.setAttribute("aria-live", "polite");

      // Set title from theme settings (prefer data attribute)
      if (el.title) {
        const title = ds.title || settings.widget_title;
        if (title) el.title.textContent = title;
      }

      // Restore session if enabled
      if (settings.remember_chat_session && sessionStorage.getItem(state.key)) {
        try {
          state.messages = JSON.parse(sessionStorage.getItem(state.key));
          renderAll();
        } catch {}
      }

      // Show welcome message if no history
      if (state.messages.length === 0) {
        appendWelcome();
      }

      // Close modal function
      const closeChat = () => {
        if (el.widget) {
          el.widget.classList.remove("visible");
          setTimeout(() => {
            el.widget.style.display = "none";
          }, 300); // Wait for animation
        }
      };

      // Close button handler
      el.close?.addEventListener("click", closeChat);

      // Clear chat handler
      el.clear?.addEventListener("click", () => {
        state.messages = [];
        sessionStorage.removeItem(state.key);
        if (el.feed) el.feed.innerHTML = "";
        appendMeta("Chat cleared.");
        appendWelcome();
      });

      // ESC key handler
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && el.widget?.classList.contains("visible")) {
          closeChat();
        }
      });

      // Click backdrop to close
      el.widget?.addEventListener("click", (e) => {
        if (e.target === el.widget) {
          closeChat();
        }
      });

      // Global helper function to open chat from anywhere
      window.openAMEChat = function() {
        if (el.widget) {
          el.widget.style.display = "flex";
          el.widget.classList.add("visible");
          setTimeout(() => {
            if (el.area) {
              el.area.focus();
            }
          }, 50);
        }
      };

      // Handle Enter key to send message
      el.area?.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSendClick();
        }
      });

      el.send?.addEventListener("click", onSendClick);

      function persist() {
        if (settings.remember_chat_session) {
          sessionStorage.setItem(state.key, JSON.stringify(state.messages));
        }
      }

      function append(msg) {
        // msg: { type, text?, html?, images?, citations? }
        state.messages.push(msg);
        persist();
        const node = renderNodeFromMessage(msg);
        el.feed?.appendChild(node);
        el.feed?.scrollTo({ top: el.feed.scrollHeight, behavior: "smooth" });
      }

      function appendMeta(text) {
        const div = document.createElement("div");
        div.className = "ame-msg meta";
        div.innerHTML = `<span class="bubble"><span class="spinner" aria-hidden="true"></span> ${escapeHtml(text)}</span>`;
        el.feed?.appendChild(div);
        el.feed?.scrollTo({ top: el.feed.scrollHeight, behavior: "smooth" });
      }

      function appendTyping() {
        console.log("[AME Chat] Creating typing indicator");
        
        // Double-check feed element exists
        const feedElement = el.feed || document.getElementById("ame-chat-messages");
        
        if (!feedElement) {
          console.error("[AME Chat] ERROR: Feed element #ame-chat-messages not found!", {
            el_feed: el.feed,
            getElementById: document.getElementById("ame-chat-messages"),
            widget: document.getElementById("ame-chat-widget")
          });
          return null;
        }
        
        console.log("[AME Chat] Feed element found:", feedElement);
        
        const div = document.createElement("div");
        div.className = "ame-msg meta typing";
        div.innerHTML = `<span class="bubble"><span class="dots"><span></span><span></span><span></span></span> Assistant is typing…</span>`;
        
        feedElement.appendChild(div);
        console.log("[AME Chat] Typing indicator appended. Parent:", div.parentElement?.id);
        
        // Scroll to bottom
        feedElement.scrollTo({ top: feedElement.scrollHeight, behavior: "smooth" });
        
        return div;
      }

      function appendWelcome() {
        if (!el.feed) return;
        const div = document.createElement("div");
        div.className = "ame-msg welcome";
        div.innerHTML = `
          <div class="welcome-bubble">
            <div class="welcome-icon">👋</div>
            <div class="welcome-text">
              <strong>Welcome to ${settings.widget_title || 'AME-Bot'}!</strong>
              <p>Ask me anything about our knowledge base, documentation, or technical topics. I'm here to help!</p>
            </div>
          </div>
        `;
        el.feed.appendChild(div);
      }

      function renderAll() {
        if (!el.feed) return;
        el.feed.innerHTML = "";
        state.messages.forEach(m => {
          el.feed.appendChild(renderNodeFromMessage(m));
        });
        el.feed.scrollTop = el.feed.scrollHeight;
      }

      function renderNodeFromMessage(m) {
        const wrap = document.createElement("div");
        wrap.className = `ame-msg ${m.type}`;
        
        if (m.type === "assistant") {
          const bubble = document.createElement("div");
          bubble.className = "bubble";
          bubble.innerHTML = m.html || `<span>${escapeHtml(m.text || "")}</span>`;
          wrap.appendChild(bubble);
          
          // Render images in grid with lightbox
          if (m.images?.length) {
            const grid = document.createElement("div");
            grid.className = "images-grid";
            m.images.forEach(src => {
              if (!isSafeUrl(src)) return;
              const imgWrap = document.createElement("div");
              imgWrap.className = "image-item";
              imgWrap.onclick = () => openImageLightbox(src);
              
              const img = document.createElement("img");
              img.src = src;
              img.loading = "lazy";
              img.referrerPolicy = "no-referrer";
              img.alt = "Document image";
              img.onerror = () => {
                imgWrap.innerHTML = '<div class="image-error">❌ Failed to load</div>';
              };
              
              imgWrap.appendChild(img);
              grid.appendChild(imgWrap);
            });
            wrap.appendChild(grid);
          }
          
          // Render citations
          if (m.citations?.length) {
            const refs = document.createElement("div");
            refs.className = "citations";
            refs.innerHTML = `<div class="citations-title">📚 Sources</div>`;
            const list = document.createElement("ol");
            m.citations.forEach(c => {
              const li = document.createElement("li");
              const text = c.title || c.doc_id || "Document";
              if (c.url && isSafeUrl(c.url)) {
                const a = document.createElement("a");
                a.textContent = text;
                a.href = c.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                li.appendChild(a);
              } else {
                li.textContent = text;
              }
              list.appendChild(li);
            });
            refs.appendChild(list);
            wrap.appendChild(refs);
          }
          
          // Render tables if present
          if (m.tables?.length) {
            const tablesDiv = document.createElement("div");
            tablesDiv.className = "ame-response-tables";
            
            m.tables.forEach((tableMarkdown, index) => {
              const tableHtml = renderMarkdownTable(tableMarkdown);
              if (tableHtml) {
                const tableWrapper = document.createElement("div");
                tableWrapper.className = "table-wrapper";
                
                const tableHeader = document.createElement("div");
                tableHeader.className = "table-header";
                tableHeader.innerHTML = `<span class="table-icon">📊</span> Table ${index + 1}`;
                tableWrapper.appendChild(tableHeader);
                
                const tableContent = document.createElement("div");
                tableContent.className = "table-content";
                tableContent.innerHTML = tableHtml;
                tableWrapper.appendChild(tableContent);
                
                tablesDiv.appendChild(tableWrapper);
              }
            });
            
            if (tablesDiv.children.length > 0) {
              wrap.appendChild(tablesDiv);
            }
          }
        } else {
          const bubble = document.createElement("span");
          bubble.className = "bubble";
          bubble.textContent = m.text || "";
          wrap.appendChild(bubble);
        }
        
        return wrap;
      }

      function openImageLightbox(src) {
        // Create lightbox overlay
        const lightbox = document.createElement("div");
        lightbox.className = "ame-image-lightbox";
        lightbox.onclick = (e) => {
          if (e.target === lightbox) lightbox.remove();
        };
        
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Full size image";
        
        const closeBtn = document.createElement("button");
        closeBtn.className = "lightbox-close";
        closeBtn.innerHTML = "✕";
        closeBtn.onclick = () => lightbox.remove();
        
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);
        
        // ESC key closes lightbox
        const escHandler = (e) => {
          if (e.key === "Escape") {
            lightbox.remove();
            document.removeEventListener("keydown", escHandler);
          }
        };
        document.addEventListener("keydown", escHandler);
      }


      function escapeHtml(s = "") {
        return s.replace(/[&<>"']/g, c => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
      }

      function isSafeUrl(u) {
        try {
          const url = new URL(u, window.location.origin);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch { return false; }
      }

      function renderMarkdownTable(markdown) {
        if (!markdown || typeof markdown !== 'string') return '';
        
        const lines = markdown.trim().split('\n').filter(line => line.trim());
        if (lines.length < 3) return ''; // Need header + separator + at least one row
        
        // Parse header row
        const headerCells = lines[0].split('|')
          .map(cell => cell.trim())
          .filter(cell => cell);
        
        if (headerCells.length === 0) return '';
        
        // Skip separator line (line 1 with |---|---|)
        // Parse data rows starting from line 2
        const dataRows = lines.slice(2).map(line => 
          line.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell)
        ).filter(row => row.length > 0);
        
        // Build HTML table
        let html = '<table class="markdown-table">';
        html += '<thead><tr>';
        headerCells.forEach(header => {
          html += `<th>${escapeHtml(header)}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        dataRows.forEach(row => {
          html += '<tr>';
          row.forEach(cell => {
            html += `<td>${escapeHtml(cell)}</td>`;
          });
          html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
      }

      function toRichHtml(text = "") {
        // Escape first, then add enhanced markdown support
        let html = escapeHtml(text);
        
        // Headers: ### H3, ## H2, # H1
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Bold: **text** or __text__
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Italic: *text* or _text_
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // Code blocks: ```lang\ncode```
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => 
          `<pre><code class="lang-${lang || 'text'}">${code.trim()}</code></pre>`);
        
        // Inline code: `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Lists: - item or * item
        html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Numbered lists: 1. item
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        
        // Links: [text](url)
        html = html.replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, 
          (m, t, u) => isSafeUrl(u) ? `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>` : t);
        
        // Autolink bare URLs
        html = html.replace(/(https?:\/\/[^\s<]+[^<.,;:'"\]\s])/g, 
          (u) => isSafeUrl(u) ? `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>` : u);
        
        // Paragraphs
        html = html.replace(/\n\n+/g, '</p><p>')
          .replace(/^(?!<[h\/uop])/gm, '<p>')
          .replace(/$/,'</p>')
          .replace(/\n/g, '<br/>');
        
        return html;
      }

      function onSendClick() {
        if (state.sending) {
          state.abort?.abort();
          return;
        }
        sendMessage();
      }

      async function sendMessage() {
        if (state.sending) return;
        const msg = (el.area?.value || "").trim();
        if (!msg) return;

        append({ type: "user", text: msg });
        if (el.area) el.area.value = "";
        state.sending = true;
        if (el.send) { el.send.disabled = false; el.send.textContent = "Stop"; }

        const typingNode = appendTyping();

        const currentUser = api.getCurrentUser();
        const context = {
          siteUrl: window.location.origin,
          path: window.location.pathname,
          topicId: api.getCurrentTopic?.()?.id || null,
          user: currentUser ? {
            id: currentUser.id,
            username: currentUser.username,
            name: currentUser.name
          } : null
        };

        const headers = { "Content-Type": "application/json" };
        if (bearerFromSettings) {
          headers["Authorization"] = `Bearer ${bearerFromSettings}`;
        }

        if (webhookMissing) {
          typingNode?.remove();
          appendConfig();
          state.sending = false;
          if (el.send) { el.send.disabled = false; el.send.textContent = "Send"; }
          return;
        }

        const controller = new AbortController();
        state.abort = controller;

        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers,
            body: JSON.stringify({ query: msg, context }),
            mode: "cors",
            credentials: "omit",
            signal: controller.signal
          });

          // Keep typing indicator visible while processing response

          if (!res.ok) {
            typingNode?.remove();
            const bodyText = await res.text().catch(() => "");
            let message = `Server error (${res.status})`;
            if (res.status === 429) message = "Rate limit exceeded. Please try again in a bit.";
            else if (bodyText && bodyText.length < 200) message += `: ${bodyText}`;
            append({ type: "assistant", text: message });
            return;
          }

          const ct = res.headers.get("content-type") || "";

          if (/text\/event-stream|ndjson|stream|text\//i.test(ct)) {
            // Streamed response (SSE/NDJSON/plain text): progressively render
            typingNode?.remove(); // Remove before starting to stream
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = "";
            const partial = { type: "assistant", html: toRichHtml("") };
            const node = renderNodeFromMessage(partial);
            el.feed?.appendChild(node);
            el.feed?.scrollTo({ top: el.feed.scrollHeight, behavior: "smooth" });
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              acc += decoder.decode(value, { stream: true });
              // try to parse SSE lines: data: {"delta":"..."}
              const chunks = acc.split(/\n\n|\r\n\r\n/);
              if (chunks.length > 1) {
                // render everything except last (possibly partial)
                for (let i = 0; i < chunks.length - 1; i++) {
                  const seg = chunks[i];
                  const m = seg.match(/data:\s*(.*)/);
                  const payload = m ? m[1] : seg;
                  try {
                    const j = JSON.parse(payload);
                    if (typeof j.delta === "string") {
                      partial.html = toRichHtml((partial.plain || "") + j.delta);
                      partial.plain = (partial.plain || "") + j.delta;
                      node.querySelector('.bubble').innerHTML = partial.html;
                    } else if (typeof j.text === "string") {
                      partial.html = toRichHtml((partial.plain || "") + j.text);
                      partial.plain = (partial.plain || "") + j.text;
                      node.querySelector('.bubble').innerHTML = partial.html;
                    }
                  } catch {
                    // treat as plain text
                    partial.html = toRichHtml((partial.plain || "") + payload);
                    partial.plain = (partial.plain || "") + payload;
                    node.querySelector('.bubble').innerHTML = partial.html;
                  }
                }
                acc = chunks[chunks.length - 1];
              }
            }
            if (acc) {
              partial.html = toRichHtml((partial.plain || "") + acc);
              node.querySelector('.bubble').innerHTML = partial.html;
            }
            state.messages.push({ type: "assistant", html: node.querySelector('.bubble').innerHTML });
            persist();
          } else if (ct.includes("application/json")) {
            const rawText = await res.text();
            if (!rawText || rawText.trim() === "") {
              typingNode?.remove();
              append({ type: "assistant", text: "⚠️ Server returned empty response. Workflow may have failed." });
              return;
            }
            let parsedJson;
            try { parsedJson = JSON.parse(rawText); } catch {
              typingNode?.remove();
              append({ type: "assistant", text: `⚠️ Invalid JSON from server: ${rawText.slice(0,100)}` });
              return;
            }
            
            // Handle array wrapper from n8n (returns [{answer, ...}] format)
            let data = parsedJson;
            if (Array.isArray(parsedJson) && parsedJson.length > 0) {
              data = parsedJson[0];
            }
            
            // Extract answer field (n8n format) - check 'answer' before 'reply'
            const text = data?.answer || data?.reply || data?.response || data?.text || data?.message || data?.output || "";
            
            // Validate we got actual content
            if (!text || text.trim() === "") {
              console.error("Empty response received:", data);
              typingNode?.remove();
              append({ type: "assistant", text: "⚠️ Received empty response from server. Workflow may have failed." });
              return;
            }
            
            // Extract images - handle both string arrays and object arrays {url, caption, page}
            const images = (data?.images || data?.image_urls || [])
              .map(img => {
                if (typeof img === 'string') return img;
                if (typeof img === 'object' && img?.url) return img.url;
                return null;
              })
              .filter(url => url && isSafeUrl(url));
            
            // Extract tables from response
            const tables = (data?.tables || [])
              .filter(table => table && (table.markdown || typeof table === 'string'))
              .map(table => typeof table === 'object' ? table.markdown : table);
            
            // Extract citations
            const citations = (data?.citations || data?.sources || data?.references || []).map(x => ({
              title: x.section_path || x.title || x.name || (x.page_start ? `Page ${x.page_start}` : "Document"),
              url: x.url || x.href,
              doc_id: x.doc_id,
              chunk_id: x.chunk_id
            })).filter(c => c.title || c.doc_id);
            
            // Log metadata for debugging
            if (data?.metadata) {
              console.log("Chat response metadata:", data.metadata);
            }
            
            // Remove typing indicator right before displaying response
            typingNode?.remove();
            
            append({ type: "assistant", html: toRichHtml(String(text)), images, citations, tables });
          } else {
            const text = await res.text();
            if (!text || text.trim() === "") {
              typingNode?.remove();
              append({ type: "assistant", text: "⚠️ Server returned empty response. Workflow may have failed." });
              return;
            }
            typingNode?.remove();
            append({ type: "assistant", html: toRichHtml(text) });
          }
        } catch (err) {
          typingNode?.remove();
          if (err?.name === 'AbortError') {
            // Show canceled indicator
            append({ type: "assistant", text: "✋ Request canceled." });
          } else {
            append({ type: "assistant", text: `❌ Network error: ${err?.message || err}` });
          }
        } finally {
          state.sending = false;
          state.abort = null;
          if (el.send) { el.send.disabled = false; el.send.textContent = "Send"; }
          el.area?.focus();
        }
      }

      function removeLastMeta() {
        if (!el.feed) return;
        const metas = el.feed.querySelectorAll(".ame-msg.meta");
        const last = metas[metas.length - 1];
        last?.remove();
      }

      function appendConfig() {
        if (!el.feed) return;
        const wrap = document.createElement("div");
        wrap.className = "ame-msg assistant";
        wrap.innerHTML = `
          <div class="bubble config">
            Chat is not configured. Please set the <code>webhook_url</code> in theme settings.
          </div>
        `;
        el.feed.appendChild(wrap);
        el.feed.scrollTop = el.feed.scrollHeight;
      }
    });
  }
};
