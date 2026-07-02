import React from "react";
import { useTranslation } from "react-i18next";

import { useCreateMenuPage } from "hooks/useCreateMenuPage";

import { MenuFormFields } from "components/forms/MenuFormFields";
import { AppShell } from "components/layout/AppShell";

const CreateMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const { form, categories, allRecipes, handleSubmit } = useCreateMenuPage();

    return (
        <AppShell>
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("createMenuPage.heading")}
                </h1>
                <form className="space-y-4">
                    <MenuFormFields
                        form={form}
                        categories={categories}
                        allRecipes={allRecipes}
                        idPrefix="create-menu"
                        keyPrefix="createMenuPage"
                    />
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                void handleSubmit();
                            }}
                            className="w-full py-2 bg-green-500 text-white rounded-md"
                        >
                            {t("createMenuPage.createButton")}
                        </button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
};

export default CreateMenuPage;
