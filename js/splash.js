/* ProjectKita — splash screen behaviour */
(function () {
  "use strict";

  const bootSplash = document.getElementById("bootSplash");
  if (!bootSplash) return;

  const HAS_SEEN_BOOT_KEY = "bootSplashSeen";
  const alreadySeen = window.pkSession.get(HAS_SEEN_BOOT_KEY);

  function hideBootSplash() {
    bootSplash.classList.add("hide");
    setTimeout(() => bootSplash.remove(), 550);
  }

  if (alreadySeen) {
    // Skip the animated logo intro on repeat visits; go straight to content.
    bootSplash.remove();
  } else {
    window.pkSession.set(HAS_SEEN_BOOT_KEY, true);
    setTimeout(hideBootSplash, 1400);
  }
})();
