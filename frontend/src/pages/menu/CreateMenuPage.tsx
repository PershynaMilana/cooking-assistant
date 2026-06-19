import React from "react";
import { useTranslation } from "react-i18next";

import { useCreateMenuForm } from "hooks/useCreateMenuForm";

import { MenuFormFields } from "components/forms/MenuFormFields";
import { Header } from "components/layout/Header";

const CreateMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const ctrl = useCreateMenuForm();
    const { handleSubmit } = ctrl;

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("createMenuPage.heading")}
                </h1>
                <form className="space-y-4">
                    <MenuFormFields
                        form={ctrl.form}
                        categories={ctrl.categories}
                        allRecipes={ctrl.allRecipes}
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

                {ctrl.fetchError && (
                    <div className="text-red-500 text-sm mt-4">
                        {ctrl.fetchError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateMenuPage;
