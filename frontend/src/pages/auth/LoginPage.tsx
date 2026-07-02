import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useLoginForm } from "hooks/useLoginForm";

import { LoginForm } from "components/forms/auth/LoginForm";

const LoginPage: React.FC = () => {
    const { t } = useTranslation("auth");
    const form = useLoginForm();

    return (
        <div className="mx-[35vw] flex flex-column items-center justify-center mt-[15vh]">
            <div className="w-full">
                <h1 className="text-relative-h3 items-center my-[7vh] font-kharkiv font-bold mb-4">
                    {t("loginPage.heading")}
                </h1>
                <LoginForm
                    values={form.values}
                    onFieldChange={form.setField}
                    onSubmit={form.handleSubmit}
                    submitLabel={t("loginPage.submit")}
                    submitError={form.error}
                    isLocked={form.isLocked}
                    lockoutRemainingMs={form.lockoutRemainingMs}
                />
                <p className="mt-4 text-center">
                    {t("loginPage.noAccount")}{" "}
                    <Link to={ROUTES.registration} className="underline">
                        {t("loginPage.registerLink")}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
