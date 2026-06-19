import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useEditRecipeForm } from "hooks/useEditRecipeForm";

import { RecipeForm } from "components/forms/RecipeForm";
import { Header } from "components/layout/Header";

const ChangeRecipePage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const { id } = useParams<{ id: string }>();
    const ctrl = useEditRecipeForm(id);
    const { handleSubmit } = ctrl;

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-bold">
                    {t("changeRecipePage.heading")}
                </h1>
                <RecipeForm
                    form={ctrl.form}
                    allIngredients={ctrl.allIngredients}
                    allTypes={ctrl.allTypes}
                    keyPrefix="changeRecipePage"
                    idPrefix="edit-recipe"
                    typeError={null}
                    error={ctrl.form.error}
                    submitLabel={t("changeRecipePage.updateButton")}
                    onSubmit={() => {
                        void handleSubmit();
                    }}
                />
            </div>
        </div>
    );
};

export default ChangeRecipePage;
