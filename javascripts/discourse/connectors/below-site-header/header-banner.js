// Header banner rotating quotes
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  setupComponent(args, component) {
    const themeSettings = settings;
    
    withPluginApi("0.8.31", (api) => {
      const checkAndToggleBanner = () => {
        const banner = document.querySelector('.ame-header-banner');
        if (!banner) return;

        // Check if we should show the banner based on current page context
        const html = document.documentElement;
        const body = document.body;
        
        let shouldShow = false;
        
        // Check page type and corresponding setting
        if (html.classList.contains('admin-interface') || body.classList.contains('admin-interface')) {
          shouldShow = themeSettings.show_banner_on_admin;
        } else if (body.classList.contains('categories-index') || body.classList.contains('navigation-categories')) {
          shouldShow = themeSettings.show_banner_on_homepage;
        } else if (body.classList.contains('archetype-regular')) {
          // Individual topic view
          shouldShow = themeSettings.show_banner_on_topic_view;
        } else if (api.getCurrentUser()) {
          // Logged in, on topic lists (latest, top, etc)
          shouldShow = themeSettings.show_banner_on_topics;
        } else {
          // Default to homepage setting for other pages
          shouldShow = themeSettings.show_banner_on_homepage;
        }
        
        // Toggle visibility
        if (shouldShow) {
          banner.style.display = '';
          initializeQuotes(themeSettings);
        } else {
          banner.style.display = 'none';
          // Clear interval when hiding
          if (window.ameHeaderQuotesInterval) {
            clearInterval(window.ameHeaderQuotesInterval);
          }
        }
      };
      
      // Initialize on page load
      setTimeout(() => {
        checkAndToggleBanner();
        pruneGettingStarted();
      }, 100);

      // Reinitialize on route changes
      api.onPageChange(() => {
        setTimeout(() => {
          checkAndToggleBanner();
          pruneGettingStarted();
        }, 100);
      });
    });
  }
};

function initializeQuotes(themeSettings) {
  const quoteElement = document.querySelector(".ame-banner-quote .quote-text");
  if (!quoteElement) return;

  // Load quotes from theme settings
  // Format: "QUOTE TEXT|word1,word2,word3" where words after | are bolded
  const quotes = [];
  
  for (let i = 1; i <= 7; i++) {
    const settingValue = themeSettings ? themeSettings[`quote_${i}`] : null;
    if (settingValue && settingValue.trim()) {
      const parts = settingValue.split('|');
      const text = parts[0] || '';
      const boldWords = parts[1] ? parts[1].split(',').map(w => w.trim()).filter(w => w) : [];
      
      if (text) {
        quotes.push({ text, bold: boldWords });
      }
    }
  }

  // Fallback if no quotes configured
  if (quotes.length === 0) {
    quotes.push(
      { text: "ALONE WE CAN DO SO LITTLE; TOGETHER WE CAN DO MUCH.", bold: ["ALONE", "TOGETHER"] },
      { text: "KNOWLEDGE SHARED IS KNOWLEDGE SQUARED.", bold: ["SHARED", "SQUARED"] },
      { text: "RAISE THE FLOOR, THEN RAISE THE CEILING.", bold: ["RAISE", "FLOOR", "CEILING"] }
    );
  }

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

  // Align sidebar with banner height
  updateBannerOffset();
  window.addEventListener("resize", updateBannerOffset, { passive: true });

  // Rotate every 15 seconds
  window.ameHeaderQuotesInterval = setInterval(() => {
    quoteElement.classList.remove('visible');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      displayQuote(quotes[currentIndex]);
    }, 1250);
  }, 15000);
}

function updateBannerOffset() {
  const banner = document.querySelector('.ame-header-banner');
  const html = document.documentElement;
  if (!banner) {
    html.style.removeProperty('--ame-banner-height');
    document.body.classList.remove('ame-has-banner');
    return;
  }
  const h = Math.round(banner.getBoundingClientRect().height);
  html.style.setProperty('--ame-banner-height', `${h}px`);
  document.body.classList.add('ame-has-banner');
}

function pruneGettingStarted() {
  const links = document.querySelectorAll('.d-header .extra-info-wrapper a');
  links.forEach((a) => {
    const txt = (a.textContent || '').trim().toLowerCase();
    if (txt === 'getting started' || txt.includes('getting started')) {
      a.style.display = 'none';
    }
  });
}
