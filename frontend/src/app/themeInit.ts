import { THEME_STORAGE_KEY } from "constants/theme";

const THEME_COLORS = {
    dark: process.env.THEME_COLOR_DARK,
    light: process.env.THEME_COLOR_LIGHT,
};

// inlined into <head> so the stored (or OS) theme is applied before the first paint;
// ThemeManager takes over once React is live. The colours come from the design tokens
// at build time, so this never repeats a value that lives in _tokens.scss.
export const themeInitScript = `(() => {
    const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = stored === "light" || (stored === null && prefersLight) ? "light" : "dark";
    const colors = ${JSON.stringify(THEME_COLORS)};

    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors[theme]);
})();`;
