// script.js — persistent theme toggle + cross-tab sync

const THEME_KEY = "site-theme"; // value: "dark" or "light"
const toggle = document.getElementById("themeToggle");

// apply theme to document body and update toggle button UI
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
        if (toggle) toggle.innerText = "☀️";
        if (toggle) toggle.setAttribute("aria-pressed", "true");
    } else {
        document.documentElement.classList.remove("dark");
        if (toggle) toggle.innerText = "🌙";
        if (toggle) toggle.setAttribute("aria-pressed", "false");
    }
}

// read saved theme from localStorage (fallback to system preference then light)
function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;

    // optional: respect system theme on first visit
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
}

// toggle theme and save to localStorage
function toggleTheme() {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
}

// initialize theme when page loads
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

// sync theme across tabs
window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY) {
        const newTheme = e.newValue === "dark" ? "dark" : "light";
        applyTheme(newTheme);
    }
});
