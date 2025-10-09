// Version 1.2 - Integrated with hero section
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  setupComponent(args, component) {
    withPluginApi("0.8.31", (api) => {
      api.onPageChange((url) => {
        if (url === "/categories" || url === "/") {
          // Wait for DOM to be ready
          setTimeout(() => {
            const quoteElement = document.querySelector(".ame-rotating-quote .q-text");
            if (!quoteElement) return;

            const quotes = [
              "NEVER SETTLE",
              "PUSH YOUR LIMITS", 
              "CHALLENGE ACCEPTED",
              "INNOVATE. INTEGRATE. INSPIRE.",
              "EXCELLENCE IN EVERY CONNECTION"
            ];

            let currentIndex = 0;

            // Initial display with fade-in
            quoteElement.textContent = quotes[currentIndex];
            setTimeout(() => {
              quoteElement.style.opacity = "1";
            }, 100);

            // Clear any existing interval
            if (window.ameQuotesInterval) {
              clearInterval(window.ameQuotesInterval);
            }

            // Rotate every 5 seconds
            window.ameQuotesInterval = setInterval(() => {
              quoteElement.style.opacity = "0";

              setTimeout(() => {
                currentIndex = (currentIndex + 1) % quotes.length;
                quoteElement.textContent = quotes[currentIndex];
                quoteElement.style.opacity = "1";
              }, 500);
            }, 5000);
          }, 150);
        }
      });
    });
  }
};
