import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { NAV_ITEMS } from "constants/navigation";

import styles from "./MainNav.module.scss";

interface MainNavProps {
    variant?: "bar" | "drawer";
    onNavigate?: () => void;
}

const BAR_ICON_SIZE = 17;
const DRAWER_ICON_SIZE = 19;

export const MainNav: React.FC<MainNavProps> = ({
    variant = "bar",
    onNavigate,
}) => {
    const { t } = useTranslation();
    const iconSize = variant === "drawer" ? DRAWER_ICON_SIZE : BAR_ICON_SIZE;

    return (
        <nav className={styles[`main-nav--${variant}`]}>
            {NAV_ITEMS.map(({ to, labelKey, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        [
                            styles["main-nav__item"],
                            isActive && styles["main-nav__item--active"],
                        ]
                            .filter(Boolean)
                            .join(" ")
                    }
                >
                    <Icon size={iconSize} aria-hidden="true" />
                    <span>{t(labelKey)}</span>
                </NavLink>
            ))}
        </nav>
    );
};
