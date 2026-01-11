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

document.querySelectorAll("a").forEach(link => {
    const url = link.getAttribute("href");
    if (!url || url.startsWith("#") || url.startsWith("http")) return;

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

// -----------------------------
// Lightbox / Full Image Preview
// -----------------------------

// Open Lightbox
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.style.display = 'flex';
  // optional: zoom-in effect
  img.style.transform = 'scale(0.8)';
  setTimeout(() => {
    img.style.transform = 'scale(1)';
  }, 10);
}

// Close Lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
}

// Close lightbox if user clicks outside the image
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target.id === 'lightbox') closeLightbox();
});

