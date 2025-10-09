// Header banner rotating quotes
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  setupComponent(args, component) {
    withPluginApi("0.8.31", (api) => {
      // Initialize on page load
      setTimeout(() => {
        initializeQuotes();
      }, 100);

      // Reinitialize on route changes
      api.onPageChange(() => {
        setTimeout(() => {
          initializeQuotes();
        }, 100);
      });
    });
  }
};

function initializeQuotes() {
  const quoteElement = document.querySelector(".ame-banner-quote .quote-text");
  if (!quoteElement) return;

  const quotes = [
    "ALONE WE CAN DO SO LITTLE; TOGETHER WE CAN DO MUCH.",
    "KNOWLEDGE SHARED IS KNOWLEDGE SQUARED.",
    "RAISE THE FLOOR, THEN RAISE THE CEILING.",
    "PUT KNOWLEDGE WHERE PEOPLE TRIP OVER IT.",
    "EVERYBODY IS SMARTER THAN ANYBODY.",
    "KNOWLEDGE IS LIKE MONEY: TO BE OF VALUE IT MUST CIRCULATE.",
    "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT."
  ];

  let currentIndex = 0;

  // Initial display
  quoteElement.textContent = quotes[currentIndex];
  quoteElement.style.opacity = "1";

  // Clear any existing interval
  if (window.ameHeaderQuotesInterval) {
    clearInterval(window.ameHeaderQuotesInterval);
  }

  // Rotate every 4 seconds
  window.ameHeaderQuotesInterval = setInterval(() => {
    quoteElement.style.opacity = "0";

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      quoteElement.textContent = quotes[currentIndex];
      quoteElement.style.opacity = "1";
    }, 400);
  }, 4000);
}
