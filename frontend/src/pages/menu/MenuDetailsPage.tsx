import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "redux/hooks";
import { useGetMenuByIdQuery } from "redux/services/menusApi";
import { MODAL_TYPE, openModal } from "redux/slices/uiSlice";

import { AppShell } from "components/layout/AppShell";
import { GroupedRecipesList } from "components/menu/GroupedRecipesList";
import { MenuMetaInfo } from "components/menu/MenuMetaInfo";
import { MenuOwnerActions } from "components/menu/MenuOwnerActions";
import { MissingIngredientsList } from "components/menu/MissingIngredientsList";

import {
    aggregateMissingIngredients,
    groupRecipesByType,
} from "utils/menuUtils";
import { getQueryErrorMessage } from "utils/queryError";

const MenuDetailsPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data: menu, isError, error } = useGetMenuByIdQuery(id ?? skipToken);

    const renderContent = () => {
        if (isError) {
            return (
                <div className="text-red-500">
                    {t("menuDetailsPage.error", {
                        message: getQueryErrorMessage(error),
                    })}
                </div>
            );
        }

        if (!menu) {
            return <div>{t("menuDetailsPage.loading")}</div>;
        }

        const isOwner = menu.menu.isOwner;
        const groupedRecipes = groupRecipesByType(menu.recipes);
        const missingIngredients = aggregateMissingIngredients(menu.recipes);

        return (
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
                            dispatch(
                                openModal({
                                    type: MODAL_TYPE.deleteMenu,
                                    menuId: menu.menu.id,
                                }),
                            );
                        }}
                    />
                )}
            </div>
        );
    };

    return <AppShell>{renderContent()}</AppShell>;
};

export default MenuDetailsPage;
