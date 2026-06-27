import React from "react";
import { useTranslation } from "react-i18next";

import { useLoginForm } from "hooks/useLoginForm";

import { LoginForm } from "components/forms/auth/LoginForm";
import { Header } from "components/layout/Header";

const LoginPage: React.FC = () => {
    const { t } = useTranslation("auth");
    const form = useLoginForm();

    return (
        <div>
            <Header />
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
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
