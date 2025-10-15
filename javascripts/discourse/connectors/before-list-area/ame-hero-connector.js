// Version 1.2 - Hero cards with chat widget integration
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  setupComponent(args, component) {
    withPluginApi("1.8.0", api => {
      api.onPageChange(() => {
        // Add click handler to the AI Assistant hero card
        setTimeout(() => {
          const chatTrigger = document.getElementById("ame-hero-chat-trigger");
          const chatWidget = document.getElementById("ame-chat-widget");
          const chatTextarea = document.getElementById("ame-chat-textarea");
          
          if (chatTrigger && chatWidget) {
            // Remove any existing listeners to prevent duplicates
            chatTrigger.replaceWith(chatTrigger.cloneNode(true));
            const newChatTrigger = document.getElementById("ame-hero-chat-trigger");
            
            newChatTrigger.addEventListener("click", () => {
              chatWidget.classList.add("visible");
              // Focus the textarea after a brief delay for smooth animation
              setTimeout(() => {
                if (chatTextarea) {
                  chatTextarea.focus();
                }
              }, 100);
            });
          }
        }, 100);
      });
    });
  }
};
