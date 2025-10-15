// Version 1.3 - Hero cards with improved chat widget integration
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  setupComponent(args, component) {
    withPluginApi("1.8.0", api => {
      // Initialize on page load and on each page change
      const initChatTrigger = () => {
        setTimeout(() => {
          const chatTrigger = document.getElementById("ame-hero-chat-trigger");
          
          if (chatTrigger) {
            // Remove existing listener to prevent duplicates
            const newTrigger = chatTrigger.cloneNode(true);
            chatTrigger.parentNode.replaceChild(newTrigger, chatTrigger);
            
            // Add click handler that uses global opener
            newTrigger.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof window.openAMEChat === "function") {
                window.openAMEChat();
              }
            });
          }
        }, 150);
      };
      
      // Initialize immediately
      initChatTrigger();
      
      // Re-initialize on page changes
      api.onPageChange(() => {
        initChatTrigger();
      });
    });
  }
};
