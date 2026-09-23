/* ==========================================================================
   ProjectKita — shared app logic
   Loaded on every page: registers the service worker and exposes small
   helpers (toast, install prompt) reused by the page-specific scripts.
   ========================================================================== */

(function () {
  "use strict";

  // ---------- Service worker registration ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => console.warn("[ProjectKita] Service worker gagal didaftarkan:", err));
    });
  }

  // ---------- "Add to Home Screen" prompt ----------
  // Chrome/Android fires this event when the PWA install criteria are met.
  // We stash it so any page can trigger the native install dialog later,
  // e.g. from a custom "Install App" button you add to a page.
  window.pkDeferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.pkDeferredInstallPrompt = event;
    document.dispatchEvent(new CustomEvent("pk:install-available"));
  });

  window.pkTriggerInstall = async function pkTriggerInstall() {
    const promptEvent = window.pkDeferredInstallPrompt;
    if (!promptEvent) return false;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    window.pkDeferredInstallPrompt = null;
    return outcome === "accepted";
  };

  // ---------- Toast helper ----------
  // Pages that include <div class="toast" id="toast"> can call
  // window.pkToast("pesan") to show a brief message.
  window.pkToast = function pkToast(message, duration = 2400) {
    const toastEl = document.getElementById("toast");
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(window.__pkToastTimer);
    window.__pkToastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
  };

  // ---------- Simple local "session" helper ----------
  // No backend is wired up yet — this just keeps the demo flow (login ->
  // role selection) coherent using localStorage so refreshes don't lose
  // where the user was. Replace with real auth/session calls later.
  window.pkSession = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(`pk:${key}`));
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`pk:${key}`, JSON.stringify(value));
      } catch {
        /* storage unavailable (e.g. private mode) — fail silently */
      }
    },
  };
})();
