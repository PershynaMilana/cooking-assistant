import React from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "redux/hooks";
import { MODAL_TYPE, openModal } from "redux/slices/uiSlice";

import { useIngredientCatalog } from "hooks/useIngredientCatalog";

import { IngredientList } from "components/ingredients/IngredientList";
import { IngredientsActionBar } from "components/ingredients/IngredientsActionBar";
import { IngredientSelector } from "components/ingredients/IngredientSelector";
import { QuantityEditor } from "components/ingredients/QuantityEditor";
import { AppShell } from "components/layout/AppShell";

const IngredientsPage: React.FC = () => {
    const { t } = useTranslation("ingredients");
    const dispatch = useAppDispatch();
    const catalog = useIngredientCatalog();
    const { handleSaveOrToggleEdit, saveUpdatedQuantities } = catalog;

    return (
        <AppShell>
            <div className="mx-[15vw]">
                <h1 className="text-3xl font-bold mb-6 justify-self-center m-4">
                    {t("page.heading")}
                </h1>

                {catalog.isEditingQuantity ? (
                    <QuantityEditor
                        ingredients={catalog.updatedIngredients}
                        onQuantityChange={catalog.handleQuantityChange}
                        onSave={() => {
                            void saveUpdatedQuantities();
                        }}
                    />
                ) : (
                    <>
                        {!catalog.isEditing ? (
                            <IngredientList
                                ingredients={catalog.personIngredients}
                                onOpenHistory={(ingredient) => {
                                    dispatch(
                                        openModal({
                                            type: MODAL_TYPE.ingredientHistory,
                                            ingredientId: ingredient.id,
                                            ingredientName:
                                                ingredient.ingredient_name ??
                                                "",
                                        }),
                                    );
                                }}
                                onDelete={(ingredient) => {
                                    dispatch(
                                        openModal({
                                            type: MODAL_TYPE.deleteIngredient,
                                            ingredient,
                                        }),
                                    );
                                }}
                            />
                        ) : (
                            <IngredientSelector
                                allIngredients={catalog.allIngredients}
                                personIngredients={catalog.personIngredients}
                                selectedIngredients={
                                    catalog.selectedIngredients
                                }
                                onToggle={catalog.toggleIngredientSelection}
                            />
                        )}

                        <IngredientsActionBar
                            isEditing={catalog.isEditing}
                            onSaveOrEdit={() => {
                                void handleSaveOrToggleEdit();
                            }}
                            onEditQuantities={catalog.handleToggleQuantityEdit}
                        />
                    </>
                )}
            </div>
        </AppShell>
    );
};

export default IngredientsPage;
