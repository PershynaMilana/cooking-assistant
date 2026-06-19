import React from "react";

import type { Menu, MenuCategory } from "types/menu";

import { ListPageLayout } from "components/layout/ListPageLayout";
import { MenuCard } from "components/menu/MenuCard";
import { MenuCategoryFilter } from "components/menu/MenuCategoryFilter";
import { SearchComponent } from "components/ui/SearchComponent";

interface MenuListViewProps {
    selectedCategories: number[];
    setSelectedCategories: (categories: number[]) => void;
    categories: MenuCategory[];
    menus: Menu[];
    noMenus: boolean;
    error: string | null;
    heading: string;
    emptyMessage: string;
    searchPlaceholder: string;
    actionSlot?: React.ReactNode;
}

export const MenuListView: React.FC<MenuListViewProps> = ({
    selectedCategories,
    setSelectedCategories,
    categories,
    menus,
    noMenus,
    error,
    heading,
    emptyMessage,
    searchPlaceholder,
    actionSlot,
}) => (
    <ListPageLayout
        filterSlot={
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <SearchComponent placeholder={searchPlaceholder} />
                <div className="ml-4 mt-4 sm:mt-0">
                    <MenuCategoryFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                </div>
            </div>
        }
        actionSlot={actionSlot}
        heading={heading}
        isEmpty={noMenus}
        emptyMessage={emptyMessage}
        error={error}
    >
        {menus.map((menu) => (
            <MenuCard
                key={menu.id}
                id={menu.id}
                title={menu.title}
                categoryName={menu.categoryname}
                content={menu.menucontent}
            />
        ))}
    </ListPageLayout>
);
