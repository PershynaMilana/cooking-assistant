import React from "react";
import { useTranslation } from "react-i18next";

import { useUpdateMenuPage } from "hooks/useUpdateMenuPage";

import { MenuFormFields } from "components/forms/MenuFormFields";
import { AppShell } from "components/layout/AppShell";

const UpdateMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const { form, categories, allRecipes, isLoading, handleSubmit } =
        useUpdateMenuPage();

    if (isLoading) {
        return (
            <AppShell>
                <div>{t("changeMenuPage.loading")}</div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("changeMenuPage.heading")}
                </h1>
                <form className="space-y-4">
                    <MenuFormFields
                        form={form}
                        categories={categories}
                        allRecipes={allRecipes}
                        idPrefix="edit-menu"
                        keyPrefix="changeMenuPage"
                    />
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                void handleSubmit();
                            }}
                            className="w-full py-2 px-4 bg-green-500 text-white rounded-full"
                        >
                            {t("changeMenuPage.updateButton")}
                        </button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
};

export default UpdateMenuPage;
