import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { getMenusByPerson } from "api/menusApi";

import { useMenuList } from "hooks/useMenuList";

import { MenuListView } from "components/menu/MenuListView";

const UserMenuPage: React.FC = () => {
    const { t } = useTranslation("menu");

    const fetcher = useCallback(
        (params: Parameters<typeof getMenusByPerson>[0]) =>
            getMenusByPerson(params),
        [],
    );

    const list = useMenuList(fetcher);

    const heading =
        list.selectedCategories.length > 0
            ? t("userMenuPage.menusByCategories", {
                  names: list.selectedCategoryNames,
              })
            : t("userMenuPage.allMenus");

    const addMenuLink = (
        <Link
            to={ROUTES.addMenu}
            className="flex items-center justify-center font-montserratRegular-normal text-almost-white bg-purple-700 p-4 w-15 m-7 rounded-3xl"
        >
            {t("userMenuPage.addMenu")}
        </Link>
    );

    return (
        <MenuListView
            {...list}
            heading={heading}
            emptyMessage={t("userMenuPage.noMenus")}
            searchPlaceholder={t("userMenuPage.searchPlaceholder")}
            actionSlot={addMenuLink}
        />
    );
};

export default UserMenuPage;
