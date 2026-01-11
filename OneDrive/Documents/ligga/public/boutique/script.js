// script.js — persistent theme toggle + fade animation

const THEME_KEY = "site-theme";
const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark");
        if (toggle) toggle.innerText = "☀️";
        if (toggle) toggle.setAttribute("aria-pressed", "true");
    } else {
        document.body.classList.remove("dark");
        if (toggle) toggle.innerText = "🌙";
        if (toggle) toggle.setAttribute("aria-pressed", "false");
    }
}

function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

function toggleTheme() {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
}

(function initTheme() {
    const theme = getSavedTheme();
    applyTheme(theme);

    if (toggle) {
        if (!toggle.hasAttribute("aria-label")) {
            toggle.setAttribute("aria-label", "Toggle theme");
        }
        toggle.addEventListener("click", toggleTheme);
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
});

document.querySelectorAll("a:not([data-no-fade])").forEach(link => {

    const url = link.getAttribute("href");
    if (
  !url ||
  url.startsWith("#") ||
  url.startsWith("http")
) return;



    link.addEventListener("click", e => {
        e.preventDefault();
        document.body.classList.remove("loaded");
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    });
});

window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY) {
        const newTheme = e.newValue === "dark" ? "dark" : "light";
        applyTheme(newTheme);
    }
});

// ===== Admin console access =====
window.enableAdmin = function (secret) {
  fetch("/admin/enable", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: secret })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("✅ Admin mode enabled");
        location.reload();
      } else {
        console.log("❌ Invalid admin key");
      }
    });
};

