/* ProjectKita — login/register page behaviour */
(function () {
  "use strict";

  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  function showTab(which) {
    const isLogin = which === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabRegister.classList.toggle("active", !isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabRegister.setAttribute("aria-selected", String(!isLogin));
    formLogin.classList.toggle("active", isLogin);
    formRegister.classList.toggle("active", !isLogin);
  }

  tabLogin.addEventListener("click", () => showTab("login"));
  tabRegister.addEventListener("click", () => showTab("register"));
  document.getElementById("goRegister").addEventListener("click", () => showTab("register"));
  document.getElementById("goLogin").addEventListener("click", () => showTab("login"));

  // Open guest/marketplace preview straight to the login tab if arrived via
  // the "Lihat Marketplace" splash button.
  if (new URLSearchParams(location.search).get("guest") === "1") {
    window.pkToast("Login untuk mengakses marketplace lengkap");
  }

  // ---------- Password visibility toggle ----------
  document.querySelectorAll(".toggle-visibility").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-label", isHidden ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    });
  });

  // ---------- Simple client-side validation ----------
  function validateField(fieldEl, isValid) {
    fieldEl.classList.toggle("has-error", !isValid);
    return isValid;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    const emailOk = validateField(document.getElementById("loginEmailField"), isValidEmail(email.value));
    const passOk = validateField(document.getElementById("loginPasswordField"), password.value.length >= 6);

    if (!emailOk || !passOk) return;

    // No backend wired up yet — replace this with a real API call.
    window.pkSession.set("userEmail", email.value);
    window.pkToast("Login berhasil, mengarahkan ke pilihan peran…");
    setTimeout(() => (location.href = "role.html"), 700);
  });

  formRegister.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const agree = document.getElementById("agreeTerms");

    const nameOk = validateField(document.getElementById("registerNameField"), name.value.trim().length > 0);
    const emailOk = validateField(document.getElementById("registerEmailField"), isValidEmail(email.value));
    const passOk = validateField(document.getElementById("registerPasswordField"), password.value.length >= 6);

    if (!nameOk || !emailOk || !passOk) return;
    if (!agree.checked) {
      window.pkToast("Setujui Syarat & Ketentuan untuk melanjutkan");
      return;
    }

    // No backend wired up yet — replace this with a real API call.
    window.pkSession.set("userEmail", email.value);
    window.pkSession.set("userName", name.value);
    window.pkToast("Akun dibuat, mengarahkan ke pilihan peran…");
    setTimeout(() => (location.href = "role.html"), 700);
  });

  document.getElementById("forgotPasswordLink").addEventListener("click", (event) => {
    event.preventDefault();
    window.pkToast("Fitur reset password belum tersedia di prototipe ini");
  });
})();
