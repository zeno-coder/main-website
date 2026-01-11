const THEME_KEY = "site-theme";
const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    toggle.innerText = "☀️";
  } else {
    document.documentElement.classList.remove("dark");
    toggle.innerText = "🌙";
  }
}

function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

toggle.addEventListener("click", () => {
  const next = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";

  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

applyTheme(getSavedTheme());
