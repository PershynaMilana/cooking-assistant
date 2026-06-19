import React from "react";
import { useTranslation } from "react-i18next";

import { useRecipeTypeForm } from "hooks/useRecipeTypeForm";

import { RecipeTypeForm } from "components/forms/RecipeTypeForm";
import { Header } from "components/layout/Header";

const AddTypePage: React.FC = () => {
    const { t } = useTranslation("recipeTypes");
    const form = useRecipeTypeForm();

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("addPage.heading")}
                </h1>
                <RecipeTypeForm
                    typeData={form.typeData}
                    errors={form.errors}
                    onFieldChange={form.setField}
                    onSubmit={form.handleSubmit}
                    submitLabel={t("form.addButton")}
                />
            </div>
        </>
    );
};

export default AddTypePage;
