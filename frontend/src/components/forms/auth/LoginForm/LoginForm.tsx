import React from "react";
import { useTranslation } from "react-i18next";

import type { LoginRequest } from "types/auth";

import { FormField, PasswordField } from "components/forms/fields";

import { formatCountdown } from "utils/loginLockout";

interface LoginFormProps {
    values: LoginRequest;
    onFieldChange: (field: keyof LoginRequest, value: string) => void;
    onSubmit: () => unknown;
    submitLabel: string;
    submitError?: string | null;
    isLocked?: boolean;
    lockoutRemainingMs?: number | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    values,
    onFieldChange,
    onSubmit,
    submitLabel,
    submitError,
    isLocked,
    lockoutRemainingMs = null,
}) => {
    const { t } = useTranslation("auth");

    const displayedError =
        isLocked && lockoutRemainingMs !== null
            ? t("errors.lockoutCountdown", {
                  time: formatCountdown(lockoutRemainingMs),
              })
            : submitError;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <FormField
                id="login-username"
                label={t("fields.usernameLabel")}
                value={values.login}
                onChange={(value) => {
                    onFieldChange("login", value);
                }}
            />
            <PasswordField
                id="login-password"
                label={t("fields.passwordLabel")}
                value={values.password}
                onChange={(value) => {
                    onFieldChange("password", value);
                }}
                showLabel={t("fields.showPassword")}
                hideLabel={t("fields.hidePassword")}
            />
            {displayedError && (
                <p className="text-red-500 text-sm">{displayedError}</p>
            )}
            <button
                type="submit"
                disabled={isLocked}
                className="bg-dark-purple w-full font-montserratRegular text-center text-white py-2 px-4 rounded-full disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
};
