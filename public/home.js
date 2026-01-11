// Persistent Theme Toggle
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

// Initialize theme
(function initTheme() {
    const theme = getSavedTheme();
    applyTheme(theme);

    if (toggle) {
        if (!toggle.hasAttribute("aria-label")) toggle.setAttribute("aria-label", "Toggle theme");
        toggle.addEventListener("click", toggleTheme);
    }
})();

// Fade-in page load
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");

    // Fade-in sections on scroll
    const faders = document.querySelectorAll(".fade-on-scroll");
    const options = { threshold: 0.1 };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, options);

    faders.forEach(fader => appearOnScroll.observe(fader));
});

// Smooth page transitions for internal links
document.querySelectorAll("a:not([data-no-fade])").forEach(link => {
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

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
}

// Optional: Scroll effect for header
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
