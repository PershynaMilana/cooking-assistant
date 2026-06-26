import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useGetMenuCategoriesQuery } from "redux/services/menuCategoriesApi";
import { useCreateMenuMutation } from "redux/services/menusApi";
import { useGetAllRecipesQuery } from "redux/services/recipesApi";

import { useMenuForm } from "hooks/useMenuForm";

import { MenuFormFields } from "components/forms/MenuFormFields";
import { Header } from "components/layout/Header";

const CreateMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const navigate = useNavigate();
    const form = useMenuForm({
        errorMessages: {
            emptyTitle: t("createMenuPage.errorTitle"),
            emptyDescription: t("createMenuPage.errorDescription"),
            noCategory: t("createMenuPage.errorCategory"),
            noRecipes: t("createMenuPage.errorRecipes"),
        },
    });
    const { data: categories = [] } = useGetMenuCategoriesQuery(null);
    const { data: allRecipes = [] } = useGetAllRecipesQuery(null);
    const [createMenu] = useCreateMenuMutation();

    const handleSubmit = async () => {
        if (!form.validateForm() || form.selectedCategory === null) {
            return;
        }

        // a failed mutation is already toasted by the global listener
        const result = await createMenu({
            menuTitle: form.menuTitle,
            menuContent: form.menuDescription,
            categoryId: form.selectedCategory,
            recipeIds: form.selectedRecipes,
        });

        if ("data" in result) {
            navigate(ROUTES.menu);
        }
    };

    return (
        <div>
            <Header />
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
        </div>
    );
};

export default CreateMenuPage;
