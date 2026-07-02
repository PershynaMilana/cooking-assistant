import React from "react";
import { useTranslation } from "react-i18next";

import { useUpdateRecipePage } from "hooks/useUpdateRecipePage";

import { RecipeForm } from "components/forms/RecipeForm";
import { AppShell } from "components/layout/AppShell";

const ChangeRecipePage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const { form, allIngredients, allTypes, isLoading, handleSubmit } =
        useUpdateRecipePage();

    return (
        <AppShell>
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-bold">
                    {t("changeRecipePage.heading")}
                </h1>
                {isLoading ? (
                    <p>{t("changeRecipePage.loading")}</p>
                ) : (
                    <RecipeForm
                        form={form}
                        allIngredients={allIngredients}
                        allTypes={allTypes}
                        keyPrefix="changeRecipePage"
                        idPrefix="edit-recipe"
                        typeError={null}
                        error={form.error}
                        submitLabel={t("changeRecipePage.updateButton")}
                        onSubmit={() => {
                            void handleSubmit();
                        }}
                    />
                )}
            </div>
        </AppShell>
    );
};

export default ChangeRecipePage;
