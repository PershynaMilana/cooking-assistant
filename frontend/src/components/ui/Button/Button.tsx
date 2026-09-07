import React from "react";
import { useTranslation } from "react-i18next";

import { useIsHydrated } from "hooks/useIsHydrated";

import styles from "./Button.module.scss";

export type ButtonVariant =
    "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconOnly?: boolean;
    loading?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
    primary: styles["button--primary"],
    secondary: styles["button--secondary"],
    ghost: styles["button--ghost"],
    danger: styles["button--danger"],
    link: styles["button--link"],
};

const SIZE_CLASS: Record<ButtonSize, string> = {
    sm: styles["button--sm"],
    md: styles["button--md"],
    lg: styles["button--lg"],
};

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    iconOnly = false,
    loading = false,
    disabled = false,
    className,
    children,
    type = "button",
    ...rest
}) => {
    const { t } = useTranslation();
    // the server sends a fully clickable form before React hydrates; a submit landing then is a
    // native browser submit, which puts every field - passwords included - into the URL
    const isHydrated = useIsHydrated();
    const isAwaitingHydration = type === "submit" && !isHydrated;
    const isDisabled = disabled || loading || isAwaitingHydration;

    const classNames = [
        styles.button,
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        iconOnly && styles["button--icon-only"],
        loading && styles["button--loading"],
        isAwaitingHydration && styles["button--awaiting-hydration"],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classNames}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading ? (
                <>
                    <span
                        className={styles.button__spinner}
                        aria-hidden="true"
                    />
                    {t("button.loading")}
                </>
            ) : (
                children
            )}
        </button>
    );
};
