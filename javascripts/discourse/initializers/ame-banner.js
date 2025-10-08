import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.14.0", (api) => {
  // Rotating quotes functionality
  document.addEventListener("DOMContentLoaded", () => {
    const host = document.querySelector("#ame-quote-slot .ame-rotating-quote");
    if (!host) return;

    const quotes = [
      "ALONE WE CAN DO SO LITTLE; TOGETHER WE CAN DO MUCH.",
      "KNOWLEDGE SHARED IS KNOWLEDGE SQUARED.",
      "RAISE THE FLOOR, THEN RAISE THE CEILING.",
      "PUT KNOWLEDGE WHERE PEOPLE TRIP OVER IT.",
      "EVERYBODY IS SMARTER THAN ANYBODY.",
      "KNOWLEDGE IS LIKE MONEY: TO BE OF VALUE IT MUST CIRCULATE.",
      "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT."
    ];

    const qText = host.querySelector(".q-text");
    let i = 0;
    let first = true;

    function show(idx) {
      qText.textContent = quotes[idx];
    }

    // Show first quote immediately
    show(0);

    const period = 5500; // 5.5s per quote
    setInterval(() => {
      if (!first) {
        host.style.opacity = 0;
      }
      first = false;
      
      setTimeout(() => {
        i = (i + 1) % quotes.length;
        show(i);
        host.style.opacity = 1;
      }, 250); // 250ms fade gap
    }, period);
  });
});