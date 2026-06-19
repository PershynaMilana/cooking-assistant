import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useRecipeTypeForm } from "hooks/useRecipeTypeForm";

import { RecipeTypeForm } from "components/forms/RecipeTypeForm";
import { Header } from "components/layout/Header";

const EditRecipeType: React.FC = () => {
    const { t } = useTranslation("recipeTypes");
    const { id } = useParams<{ id: string }>();
    const form = useRecipeTypeForm(id);

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("editPage.heading")}
                </h1>
                {form.isLoading ? (
                    <p>{t("editPage.loading")}</p>
                ) : (
                    <RecipeTypeForm
                        typeData={form.typeData}
                        errors={form.errors}
                        onFieldChange={form.setField}
                        onSubmit={form.handleSubmit}
                        submitLabel={t("form.saveButton")}
                    />
                )}
            </div>
        </>
    );
};

export default EditRecipeType;
