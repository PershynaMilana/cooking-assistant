import React from "react";
import { useTranslation } from "react-i18next";

import { useCreateRecipeForm } from "hooks/useCreateRecipeForm";

import { RecipeForm } from "components/forms/RecipeForm";
import { Header } from "components/layout/Header";

const CreateRecipePage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const ctrl = useCreateRecipeForm();
    const { handleSubmit } = ctrl;

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("createRecipePage.heading")}
                </h1>
                <RecipeForm
                    form={ctrl.form}
                    allIngredients={ctrl.allIngredients}
                    allTypes={ctrl.allTypes}
                    keyPrefix="createRecipePage"
                    idPrefix="create-recipe"
                    cookingTimePlaceholder={t(
                        "createRecipePage.cookingTimePlaceholder",
                    )}
                    typeError={ctrl.form.typeError}
                    error={ctrl.form.error ?? ctrl.fetchError}
                    submitLabel={t("createRecipePage.createButton")}
                    onSubmit={() => {
                        void handleSubmit();
                    }}
                />
            </div>
        </div>
    );
};

export default CreateRecipePage;
