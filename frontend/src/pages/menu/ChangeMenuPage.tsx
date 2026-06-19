import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useEditMenuForm } from "hooks/useEditMenuForm";

import { MenuFormFields } from "components/forms/MenuFormFields";
import { Header } from "components/layout/Header";

const UpdateMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const { id } = useParams<{ id: string }>();
    const ctrl = useEditMenuForm(id);
    const { handleSubmit } = ctrl;

    if (ctrl.loading) {
        return <div>{t("changeMenuPage.loading")}</div>;
    }

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("changeMenuPage.heading")}
                </h1>
                <form className="space-y-4">
                    <MenuFormFields
                        form={ctrl.form}
                        categories={ctrl.categories}
                        allRecipes={ctrl.allRecipes}
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

                {ctrl.error && (
                    <div className="text-red-500 text-sm mt-4">
                        {ctrl.error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateMenuPage;
