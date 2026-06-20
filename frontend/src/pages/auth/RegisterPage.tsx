import React from "react";
import { useTranslation } from "react-i18next";

import { useRegisterForm } from "hooks/useRegisterForm";

import { RegisterForm } from "components/forms/auth/RegisterForm";
import { Header } from "components/layout/Header";

const RegisterPage: React.FC = () => {
    const { t } = useTranslation("auth");
    const form = useRegisterForm();

    return (
        <div>
            <Header />
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
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
