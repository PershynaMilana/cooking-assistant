import React from "react";
import { useTranslation } from "react-i18next";

import type { RegisterErrors, RegisterRequest } from "types/auth";

import { FormField, PasswordField } from "components/forms/fields";

interface RegisterFormProps {
    values: RegisterRequest;
    errors: RegisterErrors;
    onFieldChange: (field: keyof RegisterRequest, value: string) => void;
    onSubmit: () => unknown;
    submitLabel: string;
    submitError?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    values,
    errors,
    onFieldChange,
    onSubmit,
    submitLabel,
    submitError,
}) => {
    const { t } = useTranslation("auth");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <FormField
                id="register-name"
                label={t("fields.nameLabel")}
                value={values.name}
                onChange={(value) => {
                    onFieldChange("name", value);
                }}
                error={errors.name}
            />
            <FormField
                id="register-surname"
                label={t("fields.surnameLabel")}
                value={values.surname}
                onChange={(value) => {
                    onFieldChange("surname", value);
                }}
                error={errors.surname}
            />
            <FormField
                id="register-username"
                label={t("fields.usernameLabel")}
                value={values.login}
                onChange={(value) => {
                    onFieldChange("login", value);
                }}
                error={errors.login}
            />
            <PasswordField
                id="register-password"
                label={t("fields.passwordLabel")}
                value={values.password}
                onChange={(value) => {
                    onFieldChange("password", value);
                }}
                showLabel={t("fields.showPassword")}
                hideLabel={t("fields.hidePassword")}
                error={errors.password}
            />
            {submitError && (
                <p className="text-red-500 text-sm">{submitError}</p>
            )}
            <button
                type="submit"
                className="bg-dark-purple w-full font-montserratRegular text-center text-white py-2 px-4 rounded-full"
            >
                {submitLabel}
            </button>
        </form>
    );
};
