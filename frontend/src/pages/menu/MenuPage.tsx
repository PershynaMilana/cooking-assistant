import React from "react";
import { useTranslation } from "react-i18next";

import { getMenus } from "api/menusApi";

import { useMenuList } from "hooks/useMenuList";

import { MenuListView } from "components/menu/MenuListView";

const MenuPage: React.FC = () => {
    const { t } = useTranslation("menu");
    const list = useMenuList(getMenus);

    const heading =
        list.selectedCategories.length > 0
            ? t("menuPage.menusByCategories", {
                  names: list.selectedCategoryNames,
              })
            : t("menuPage.allMenus");

    return (
        <MenuListView
            {...list}
            heading={heading}
            emptyMessage={t("menuPage.noMenus")}
            searchPlaceholder={t("menuPage.searchPlaceholder")}
        />
    );
};

export default MenuPage;
