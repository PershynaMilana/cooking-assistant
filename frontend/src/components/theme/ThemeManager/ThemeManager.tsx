import { useEffect } from "react";

import { THEME_STORAGE_KEY } from "redux/slices/themeSlice";

import { useTheme } from "hooks/useTheme";

// renders nothing; syncs <html data-theme> + localStorage with the theme slice
export const ThemeManager = () => {
    const { mode } = useTheme();

    useEffect(() => {
        document.documentElement.dataset.theme = mode;
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    }, [mode]);

    return null;
};
