import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from "constants/theme";

export type ThemeMode = "dark" | "light";

// "system" isn't a renderable mode itself - it means "no stored override, resolve from prefers-color-scheme"
export type ThemeChoice = ThemeMode | "system";

const prefersLightScheme = (): boolean =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

// browser-only: reads storage and the OS preference, so it never runs during a server render
export const getInitialThemeMode = (): ThemeMode => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "dark" || stored === "light") {
        return stored;
    }

    return prefersLightScheme() ? "light" : "dark";
};

// the Settings segmented control's active option - "system" when nothing is stored, regardless of what that currently resolves to
export const getStoredThemeChoice = (): ThemeChoice => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    return stored === "dark" || stored === "light" ? stored : "system";
};

interface ThemeState {
    mode: ThemeMode;
}

// resolved by the browser and handed to the store as preloaded state; see the app providers
const initialState: ThemeState = { mode: DEFAULT_THEME_MODE };

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
