import React from "react";
import { useTranslation } from "react-i18next";

import { useCreateRecipePage } from "hooks/useCreateRecipePage";

import { RecipeForm } from "components/forms/RecipeForm";
import { Header } from "components/layout/Header";

const CreateRecipePage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const { form, allIngredients, allTypes, handleSubmit } =
        useCreateRecipePage();

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("createRecipePage.heading")}
                </h1>
                <RecipeForm
                    form={form}
                    allIngredients={allIngredients}
                    allTypes={allTypes}
                    keyPrefix="createRecipePage"
                    idPrefix="create-recipe"
                    cookingTimePlaceholder={t(
                        "createRecipePage.cookingTimePlaceholder",
                    )}
                    typeError={form.typeError}
                    error={form.error}
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
