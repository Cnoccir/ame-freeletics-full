// AME Chat widget initializer: builds chat UX and posts payloads expected by n8n
// Payload shape expected by webhook:
// { query: string, context: { siteUrl, path, topicId, user: { id, username, name } } }

import { withPluginApi } from "discourse/lib/plugin-api";

function $(sel) { return document.querySelector(sel); }
function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
}

function detectTopicId(pathname) {
  // Matches /t/slug/123 or /t/123
  const m = pathname.match(/\/t\/(?:[^/]+\/)?(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function scrollToBottom(container) {
  try { container.scrollTop = container.scrollHeight; } catch (_) {}
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem("ameChatHistory") || "[]"); } catch (_) { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem("ameChatHistory", JSON.stringify(list.slice(-50))); } catch (_) {}
}

function renderMessage(role, text) {
  const wrap = createEl("div", { class: `ame-msg ${role}` });
  const bubble = createEl("div", { class: "bubble" });
  bubble.textContent = text;
  wrap.appendChild(bubble);
  return wrap;
}

function renderWelcome() {
  const wrap = createEl("div", { class: "ame-msg welcome" });
  const bubble = createEl("div", { class: "welcome-bubble" });
  const icon = createEl("div", { class: "welcome-icon", html: "👋" });
  const txt = createEl("div", { class: "welcome-text", html: "<strong>Welcome to AME‑Bot!</strong><p>Ask about our knowledge base, documentation, or technical topics. Shift+Enter for new lines.</p>" });
  bubble.appendChild(icon); bubble.appendChild(txt); wrap.appendChild(bubble);
  return wrap;
}

export default {
  name: "ame-chat-widget",
  initialize() {
    withPluginApi("1.8.0", (api) => {
      const widget = $("#ame-chat-widget");
      if (!widget) return;
      const messages = $("#ame-chat-messages");
      const textarea = $("#ame-chat-textarea");
      const sendBtn = $("#ame-chat-send");
      const btnClose = $("#ame-chat-close");
      const btnClear = $("#ame-chat-clear");

      const endpoint = "https://rnocciolo.app.n8n.cloud/webhook/rag-chat";

      // public opener for hero card
      window.openAMEChat = function () {
        widget.classList.add("visible");
        widget.style.display = "flex";
        textarea.focus();
        if (!messages.dataset.initialized) {
          // first open: load history or show welcome
          const hist = loadHistory();
          if (hist.length) {
            hist.forEach(m => messages.appendChild(renderMessage(m.role, m.text)));
          } else {
            messages.appendChild(renderWelcome());
          }
          messages.dataset.initialized = "1";
          scrollToBottom(messages);
        }
      };

      function closeChat() {
        widget.classList.remove("visible");
        setTimeout(() => (widget.style.display = "none"), 200);
      }

      btnClose?.addEventListener("click", closeChat);
      btnClear?.addEventListener("click", () => {
        messages.innerHTML = "";
        saveHistory([]);
        messages.appendChild(renderWelcome());
      });

      textarea?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendBtn?.click();
        }
      });

      async function sendMessage() {
        const query = (textarea.value || "").trim();
        if (!query) return;

        // UI: add user message
        const userNode = renderMessage("user", query);
        messages.appendChild(userNode);
        scrollToBottom(messages);
        textarea.value = "";
        sendBtn.disabled = true;

        // Add typing indicator
        const typing = renderMessage("meta", "AME‑Bot is typing…");
        messages.appendChild(typing);
        scrollToBottom(messages);

        // Build context
        const currentUser = api.getCurrentUser?.();
        const payload = {
          query,
          context: {
            siteUrl: window.location.origin,
            path: window.location.pathname,
            topicId: detectTopicId(window.location.pathname),
            user: currentUser
              ? { id: currentUser.id, username: currentUser.username, name: currentUser.name }
              : { id: null, username: null, name: null }
          }
        };

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          messages.removeChild(typing);

          // Check HTTP status
          if (!res.ok) {
            const errText = await res.text().catch(() => "(no response body)");
            let msg = `Server error (${res.status})`;
            if (res.status === 429) msg = "Rate limit exceeded. Please try again later.";
            else if (errText && errText.length < 200) msg += `: ${errText}`;
            messages.appendChild(renderMessage("assistant", msg));
            return;
          }

          // Parse response
          const ct = res.headers.get("content-type") || "";
          let data, text;
          
          if (ct.includes("application/json")) {
            const rawText = await res.text();
            if (!rawText || rawText.trim() === "") {
              messages.appendChild(renderMessage("assistant", "⚠️ Server returned empty response. n8n workflow may have failed - check logs."));
              return;
            }
            try {
              data = JSON.parse(rawText);
            } catch (parseErr) {
              messages.appendChild(renderMessage("assistant", `⚠️ Invalid JSON from server: ${rawText.slice(0, 100)}`));
              return;
            }
          } else {
            text = await res.text();
            if (!text || text.trim() === "") {
              messages.appendChild(renderMessage("assistant", "⚠️ Server returned empty response. n8n workflow may have failed - check logs."));
              return;
            }
          }

          const answer = data?.reply || data?.response || data?.text || data?.message || data?.output || text || "(No response)";
          const botNode = renderMessage("assistant", String(answer));
          messages.appendChild(botNode);

          // persist history
          const hist = loadHistory();
          hist.push({ role: "user", text: query });
          hist.push({ role: "assistant", text: String(answer) });
          saveHistory(hist);
        } catch (err) {
          messages.removeChild(typing);
          messages.appendChild(renderMessage("assistant", `❌ Network error: ${err?.message || err}. Check that n8n workflow is running.`));
        } finally {
          sendBtn.disabled = false;
          scrollToBottom(messages);
        }
      }

      sendBtn?.addEventListener("click", sendMessage);

      // Optional: keyboard shortcut to open chat (press "/")
      document.addEventListener("keydown", (e) => {
        if ((e.key === "/" || e.key === "?") && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
          if (document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
            e.preventDefault();
            window.openAMEChat();
          }
        }
      }, true);
    });
  }
};
