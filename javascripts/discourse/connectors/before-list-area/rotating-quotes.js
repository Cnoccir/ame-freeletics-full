// Version 1.1 - Fixed modern Ember API compatibility
import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "@ember/application";

export default {
  setupComponent(args, component) {
    withPluginApi("0.8.31", (api) => {
      api.onPageChange((url) => {
        if (url === "/categories" || url === "/") {
          // Wait for DOM to be ready
          setTimeout(() => {
            const quoteElement = document.querySelector(".ame-rotating-quote .q-text");
            if (!quoteElement) return;

            const siteSettings = getOwner(component).lookup("service:site-settings");
            const quotes = [
              siteSettings.brand_quote_1 || "NEVER SETTLE",
              siteSettings.brand_quote_2 || "PUSH YOUR LIMITS",
              siteSettings.brand_quote_3 || "CHALLENGE ACCEPTED"
            ];

            let currentIndex = 0;

            // Initial display
            quoteElement.textContent = quotes[currentIndex];
            quoteElement.style.opacity = "1";

            // Clear any existing interval
            if (window.ameQuotesInterval) {
              clearInterval(window.ameQuotesInterval);
            }

            // Rotate every 4 seconds
            window.ameQuotesInterval = setInterval(() => {
              quoteElement.style.opacity = "0";

              setTimeout(() => {
                currentIndex = (currentIndex + 1) % quotes.length;
                quoteElement.textContent = quotes[currentIndex];
                quoteElement.style.opacity = "1";
              }, 300);
            }, 4000);
          }, 100);
        }
      });
    });
  }
};
