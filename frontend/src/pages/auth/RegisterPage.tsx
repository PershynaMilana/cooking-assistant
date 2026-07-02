import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useRegisterForm } from "hooks/useRegisterForm";

import { RegisterForm } from "components/forms/auth/RegisterForm";

const RegisterPage: React.FC = () => {
    const { t } = useTranslation("auth");
    const form = useRegisterForm();

    return (
        <div className="mx-[35vw] flex flex-column items-center justify-center mt-[10vh]">
            <div className="w-full">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("registerPage.heading")}
                </h1>
                <RegisterForm
                    values={form.values}
                    errors={form.errors}
                    onFieldChange={form.setField}
                    onSubmit={form.handleSubmit}
                    submitLabel={t("registerPage.submit")}
                    submitError={form.error}
                />
                <p className="mt-4 text-center">
                    {t("registerPage.haveAccount")}{" "}
                    <Link to={ROUTES.login} className="underline">
                        {t("registerPage.loginLink")}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
