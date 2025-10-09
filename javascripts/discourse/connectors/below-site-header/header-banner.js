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

  // Quotes with styled keywords (words to bold)
  const quotes = [
    { text: "ALONE WE CAN DO SO LITTLE; TOGETHER WE CAN DO MUCH.", bold: ["ALONE", "TOGETHER"] },
    { text: "KNOWLEDGE SHARED IS KNOWLEDGE SQUARED.", bold: ["SHARED", "SQUARED"] },
    { text: "RAISE THE FLOOR, THEN RAISE THE CEILING.", bold: ["RAISE", "FLOOR", "CEILING"] },
    { text: "PUT KNOWLEDGE WHERE PEOPLE TRIP OVER IT.", bold: ["KNOWLEDGE", "TRIP"] },
    { text: "EVERYBODY IS SMARTER THAN ANYBODY.", bold: ["EVERYBODY", "SMARTER", "ANYBODY"] },
    { text: "KNOWLEDGE IS LIKE MONEY: TO BE OF VALUE IT MUST CIRCULATE.", bold: ["KNOWLEDGE", "VALUE", "CIRCULATE"] },
    { text: "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT.", bold: ["PREDICT", "FUTURE", "INVENT"] }
  ];

  let currentIndex = 0;

  // Function to style quote with bold keywords
  function displayQuote(quote) {
    let styledText = quote.text;
    
    // Replace each bold word with strong tag
    quote.bold.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      styledText = styledText.replace(regex, `<strong>${word}</strong>`);
    });
    
    quoteElement.innerHTML = styledText;
    quoteElement.classList.add('visible');
  }

  // Initial display
  displayQuote(quotes[currentIndex]);

  // Clear any existing interval
  if (window.ameHeaderQuotesInterval) {
    clearInterval(window.ameHeaderQuotesInterval);
  }

  // Rotate every 5 seconds
  window.ameHeaderQuotesInterval = setInterval(() => {
    quoteElement.classList.remove('visible');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      displayQuote(quotes[currentIndex]);
    }, 600);
  }, 5000);
}
