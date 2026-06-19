import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useMenuDetails } from "hooks/useMenuDetails";

import { Header } from "components/layout/Header";
import { GroupedRecipesList } from "components/menu/GroupedRecipesList";
import { MenuMetaInfo } from "components/menu/MenuMetaInfo";
import { MenuOwnerActions } from "components/menu/MenuOwnerActions";
import { MissingIngredientsList } from "components/menu/MissingIngredientsList";
import { Modal } from "components/ui/Modal";

import {
    aggregateMissingIngredients,
    groupRecipesByType,
} from "utils/menuUtils";

const MenuDetailsPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const { id } = useParams<{ id: string }>();
    const { menu, error, isOwner, deleteMenu } = useMenuDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (error) {
        return (
            <div className="text-red-500">
                {t("menuDetailsPage.error", { message: error })}
            </div>
        );
    }

    if (!menu) {
        return <div>{t("menuDetailsPage.loading")}</div>;
    }

    const groupedRecipes = groupRecipesByType(menu.recipes);
    const missingIngredients = aggregateMissingIngredients(menu.recipes);

    return (
        <div>
            <Header />
            <div className="mx-[15vw] mb-[5vh]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {menu.menu.title}
                </h1>

                <MenuMetaInfo
                    categoryName={menu.menu.categoryname}
                    content={menu.menu.menucontent}
                />

                <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
                    <strong>{t("menuDetailsPage.recipes")}</strong>
                </p>

                <GroupedRecipesList groupedRecipes={groupedRecipes} />

                <MissingIngredientsList ingredients={missingIngredients} />

                {isOwner && (
                    <MenuOwnerActions
                        menuId={menu.menu.id}
                        onDelete={() => {
                            setIsModalOpen(true);
                        }}
                    />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={t("menuDetailsPage.deleteTitle")}
                message={t("menuDetailsPage.deleteMessage")}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                onConfirm={() => {
                    void deleteMenu();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default MenuDetailsPage;
