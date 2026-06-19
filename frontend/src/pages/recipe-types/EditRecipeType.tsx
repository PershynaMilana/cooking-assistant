import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useRecipeTypeForm } from "hooks/useRecipeTypeForm";

import { RecipeTypeForm } from "components/forms/RecipeTypeForm";
import { Header } from "components/layout/Header";

const EditRecipeType: React.FC = () => {
    const { t } = useTranslation("recipeTypes");
    const { id } = useParams<{ id: string }>();
    const form = useRecipeTypeForm(id);

    if (!id) {
        return <Navigate to={ROUTES.recipeTypes} replace />;
    }

    let formBody: React.ReactNode;

    if (form.isLoading) {
        formBody = <p>{t("editPage.loading")}</p>;
    } else if (form.loadError !== null) {
        formBody = <p className="text-red-500">{form.loadError}</p>;
    } else {
        formBody = (
            <RecipeTypeForm
                typeData={form.typeData}
                errors={form.errors}
                onFieldChange={form.setField}
                onSubmit={form.handleSubmit}
                submitLabel={t("form.saveButton")}
                submitError={form.submitError}
            />
        );
    }

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("editPage.heading")}
                </h1>
                {formBody}
            </div>
        </>
    );
};

export default EditRecipeType;
