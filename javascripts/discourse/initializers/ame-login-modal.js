import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.14.0", (api) => {
  // Add a class to login modals so our styles only affect login
  const ensureLoginClass = () => {
    document.querySelectorAll(".d-modal").forEach((m) => {
      if (m.classList.contains("login-modal")) return;
      const hasLoginFields = m.querySelector('input[type="password"], input[type="email"], input[name="login"], form[action*="/session"], form[action*="/login"]');
      if (hasLoginFields) m.classList.add("login-modal");
    });
  };

  // Observe modal container for new modals
  const observer = new MutationObserver(() => ensureLoginClass());
  observer.observe(document.body, { childList: true, subtree: true });

  // Also run on route changes
  api.onPageChange(() => ensureLoginClass());
});
