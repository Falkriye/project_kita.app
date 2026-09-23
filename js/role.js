/* ProjectKita — role selection page behaviour */
(function () {
  "use strict";

  const cards = Array.from(document.querySelectorAll(".role-card"));
  const continueBtn = document.getElementById("continueBtn");
  let selectedRole = window.pkSession.get("userRole") || null;

  function render() {
    cards.forEach((card) => {
      const isSelected = card.dataset.role === selectedRole;
      card.classList.toggle("selected", isSelected);
      card.setAttribute("aria-checked", String(isSelected));
    });
    continueBtn.disabled = !selectedRole;
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRole = card.dataset.role;
      render();
    });
  });

  continueBtn.addEventListener("click", () => {
    if (!selectedRole) return;
    window.pkSession.set("userRole", selectedRole);

    const label = selectedRole === "client" ? "Client" : "Talent";
    window.pkToast(`Peran "${label}" dipilih`);

    // No dashboard pages exist yet in this starter — wire these up to your
    // actual Client/Talent home screens once they're built.
    setTimeout(() => {
      window.pkToast(`Lanjut ke dashboard ${label} (belum dibuat)`);
    }, 900);
  });

  document.getElementById("helpBtn").addEventListener("click", () => {
    window.pkToast("Pusat bantuan belum tersedia di prototipe ini");
  });

  render();
})();
