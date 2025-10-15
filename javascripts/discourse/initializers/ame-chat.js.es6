// Initializes after Discourse boot, uses theme settings for config.
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "ame-chat-widget",
  initialize() {
    withPluginApi("1.8.0", api => {
      const settingsSvc = api.container.lookup("service:theme-settings");
      const settings = settingsSvc?.themeSettings || {};
      const webhook = settings.webhook_url;
      
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
        key: "ame_chat_session_" + window.location.pathname
      };

      const el = {
        widget: document.getElementById("ame-chat-widget"),
        close:  document.getElementById("ame-chat-close"),
        area:   document.getElementById("ame-chat-textarea"),
        send:   document.getElementById("ame-chat-send"),
        feed:   document.getElementById("ame-chat-messages")
      };

      // Restore session if enabled
      if (settings.remember_chat_session && sessionStorage.getItem(state.key)) {
        try {
          state.messages = JSON.parse(sessionStorage.getItem(state.key));
          renderAll();
        } catch {}
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
          sendMessage();
        }
      });
      
      el.send?.addEventListener("click", sendMessage);

      function append(type, text) {
        state.messages.push({ type, text });
        if (settings.remember_chat_session) {
          sessionStorage.setItem(state.key, JSON.stringify(state.messages));
        }
        const div = document.createElement("div");
        div.className = `ame-msg ${type}`;
        div.innerHTML = `<span class="bubble">${escapeHtml(text)}</span>`;
        el.feed?.appendChild(div);
        el.feed?.scrollTo({ top: el.feed.scrollHeight, behavior: "smooth" });
      }

      function appendMeta(text) {
        const div = document.createElement("div");
        div.className = "ame-msg meta";
        div.textContent = text;
        el.feed?.appendChild(div);
        el.feed?.scrollTo({ top: el.feed.scrollHeight, behavior: "smooth" });
      }

      function renderAll() {
        if (!el.feed) return;
        el.feed.innerHTML = "";
        state.messages.forEach(m => {
          const div = document.createElement("div");
          div.className = `ame-msg ${m.type}`;
          div.innerHTML = `<span class="bubble">${escapeHtml(m.text)}</span>`;
          el.feed.appendChild(div);
        });
        el.feed.scrollTop = el.feed.scrollHeight;
      }

      function escapeHtml(s = "") {
        return s.replace(/[&<>"']/g, c => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
      }

      async function sendMessage() {
        if (state.sending) return;
        const msg = (el.area?.value || "").trim();
        if (!msg) return;

        append("user", msg);
        if (el.area) el.area.value = "";
        state.sending = true;
        if (el.send) el.send.disabled = true;

        appendMeta("Assistant is typing…");

        const currentUser = api.getCurrentUser();
        const context = {
          siteUrl: window.location.origin,
          path: window.location.pathname,
          topicId: api.getCurrentTopic?.()?.id || null,
          user: currentUser ? {
            id: currentUser.id,
            username: currentUser.username,
            name: currentUser.name,
            email: currentUser?.email
          } : null
        };

        const headers = { "Content-Type": "application/json" };
        if (settings.bearer_token) {
          headers["Authorization"] = `Bearer ${settings.bearer_token}`;
        }

        if (webhookMissing) {
          removeLastMeta();
          append("assistant", "Chat is not configured. Please set the 'webhook_url' in theme settings.");
          state.sending = false;
          if (el.send) el.send.disabled = false;
          return;
        }

        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers,
            body: JSON.stringify({ query: msg, context })
          });

          removeLastMeta();

          if (!res.ok) {
            const t = await res.text();
            append("assistant", `Error ${res.status}: ${t || 'Request failed'}`);
          } else {
            const data = await res.json();
            const output = typeof data?.response === "string"
              ? data.response
              : JSON.stringify(data);
            append("assistant", output);
          }
        } catch (err) {
          removeLastMeta();
          append("assistant", `Network error: ${err?.message || err}`);
        } finally {
          state.sending = false;
          if (el.send) el.send.disabled = false;
          el.area?.focus();
        }
      }

      function removeLastMeta() {
        if (!el.feed) return;
        const metas = el.feed.querySelectorAll(".ame-msg.meta");
        const last = metas[metas.length - 1];
        last?.remove();
      }
    });
  }
};
