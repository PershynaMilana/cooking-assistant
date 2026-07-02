import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "hooks/useTheme";

import styles from "./ThemeToggle.module.scss";

const ICON_SIZE = 17;

export const ThemeToggle: React.FC = () => {
    const { t } = useTranslation();
    const { isDark, toggle } = useTheme();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={t("theme.toggleLabel")}
            className={styles["theme-toggle"]}
        >
            {isDark ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
            <span>{isDark ? t("theme.dark") : t("theme.light")}</span>
        </button>
    );
};
