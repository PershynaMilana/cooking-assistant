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

interface ButtonClassNameInput {
    variant: ButtonVariant;
    size: ButtonSize;
    iconOnly: boolean;
    loading: boolean;
    isAwaitingHydration: boolean;
    className?: string;
}

const SIZE_CLASS: Record<ButtonSize, string> = {
    sm: styles["button--sm"],
    md: styles["button--md"],
    lg: styles["button--lg"],
};

const buildClassName = ({
    variant,
    size,
    iconOnly,
    loading,
    isAwaitingHydration,
    className,
}: ButtonClassNameInput): string =>
    [
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

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    iconOnly = false,
    loading = false,
    disabled = false,
    className,
    children,
    type = "button",
    onClick,
    ...rest
}) => {
    const { t } = useTranslation();
    // the server sends fully clickable markup before React hydrates. A submit landing then is a
    // native browser submit, which puts every field - passwords included - into the URL; a click
    // handler does not exist yet at all, so the press is swallowed and the button lies about being
    // ready. Either way the control is not usable until hydration, so it says so
    const isHydrated = useIsHydrated();
    const needsHydration = type === "submit" || Boolean(onClick);
    const isAwaitingHydration = !isHydrated && needsHydration;
    const isDisabled = disabled || loading || isAwaitingHydration;

    return (
        <button
            type={type}
            className={buildClassName({
                variant,
                size,
                iconOnly,
                loading,
                isAwaitingHydration,
                className,
            })}
            disabled={isDisabled}
            onClick={onClick}
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
