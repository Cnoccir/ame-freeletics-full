import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { schedule } from "@ember/runloop";

export default Component.extend({
  tagName: "",
  
  didInsertElement() {
    this._super(...arguments);
    
    // Only show on categories route
    if (this.currentRouteName !== "discovery.categories") {
      return;
    }
    
    schedule("afterRender", () => {
      this._startRotation();
    });
  },
  
  willDestroyElement() {
    this._super(...arguments);
    if (this._rotationInterval) {
      clearInterval(this._rotationInterval);
    }
  },
  
  _startRotation() {
    const quotes = [
      settings.brand_quote_1 || "NEVER SETTLE",
      settings.brand_quote_2 || "PUSH YOUR LIMITS",
      settings.brand_quote_3 || "CHALLENGE ACCEPTED"
    ];
    
    let currentIndex = 0;
    const quoteElement = document.querySelector(".ame-rotating-quote .q-text");
    
    if (!quoteElement) return;
    
    // Initial display
    quoteElement.textContent = quotes[currentIndex];
    quoteElement.style.opacity = "1";
    
    // Rotate every 4 seconds
    this._rotationInterval = setInterval(() => {
      // Fade out
      quoteElement.style.opacity = "0";
      
      setTimeout(() => {
        // Change text
        currentIndex = (currentIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[currentIndex];
        
        // Fade in
        quoteElement.style.opacity = "1";
      }, 300);
    }, 4000);
  }
});
