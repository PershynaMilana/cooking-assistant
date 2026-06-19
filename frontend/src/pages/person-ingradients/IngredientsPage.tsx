import React from "react";
import { useTranslation } from "react-i18next";

import { useIngredientCatalog } from "hooks/useIngredientCatalog";

import { DeleteConfirmModal } from "components/ingredients/DeleteConfirmModal";
import { IngredientList } from "components/ingredients/IngredientList";
import { IngredientsActionBar } from "components/ingredients/IngredientsActionBar";
import { IngredientSelector } from "components/ingredients/IngredientSelector";
import { PurchaseHistoryModal } from "components/ingredients/PurchaseHistoryModal";
import { QuantityEditor } from "components/ingredients/QuantityEditor";
import { Header } from "components/layout/Header";

const IngredientsPage: React.FC = () => {
    const { t } = useTranslation("ingredients");
    const catalog = useIngredientCatalog();
    const {
        handleConfirmDelete,
        handleSaveOrToggleEdit,
        saveUpdatedQuantities,
    } = catalog;

    return (
        <div>
            <Header />
            <div className="w-11/12 mx-auto">
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
                                onOpenHistory={
                                    catalog.setSelectedHistoryIngredient
                                }
                                onDelete={catalog.setSelectedIngredientToDelete}
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

                {catalog.selectedIngredientToDelete && (
                    <DeleteConfirmModal
                        ingredient={catalog.selectedIngredientToDelete}
                        onConfirm={() => {
                            void handleConfirmDelete();
                        }}
                        onCancel={() => {
                            catalog.setSelectedIngredientToDelete(null);
                        }}
                    />
                )}
            </div>

            {catalog.selectedHistoryIngredient && (
                <PurchaseHistoryModal
                    ingredientId={catalog.selectedHistoryIngredient.id}
                    ingredientName={
                        catalog.selectedHistoryIngredient.ingredient_name ?? ""
                    }
                    onClose={catalog.closeHistoryModal}
                />
            )}
        </div>
    );
};

export default IngredientsPage;
