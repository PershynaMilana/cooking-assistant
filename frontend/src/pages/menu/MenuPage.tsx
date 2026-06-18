import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { Menu, MenuCategory } from "types/menu";

import { getApiErrorMessage } from "api/httpError";
import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenus } from "api/menusApi";

import { Header } from "components/layout/Header";
import MenuCard from "components/menu/MenuCard";
import MenuCategoryFilter from "components/menu/MenuCategoryFilter";
import { SearchComponent } from "components/ui/SearchComponent";

const MenuPage: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [noMenus, setNoMenus] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const menuName = searchParams.get("ingredient_name");

    const fetchMenus = useCallback(async () => {
        setError(null);
        setNoMenus(false);

        try {
            const encodedMenuName = encodeURIComponent(menuName ?? "");

            const data = await getMenus({
                menu_name: encodedMenuName,
                category_ids:
                    selectedCategories.length > 0
                        ? selectedCategories.join(",")
                        : undefined,
            });

            // process fetched data
            if (data.length === 0) {
                setNoMenus(true);
            } else {
                setMenus(data);
            }
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }, [menuName, selectedCategories]);

    useEffect(() => {
        void fetchMenus();
    }, [fetchMenus]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getMenuCategories();

                setCategories(data);
            } catch (err) {
                console.error("Error fetching menu categories.", err);
            }
        };

        void fetchCategories();
    }, []);

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <SearchComponent placeholder={"menu title"} />
                    <div className="ml-4 mt-4 sm:mt-0">
                        <MenuCategoryFilter
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onChange={setSelectedCategories}
                        />
                    </div>
                </div>

                <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
                    {selectedCategories.length > 0
                        ? `Menus by categories: ${categories
                              .filter((category) =>
                                  selectedCategories.includes(
                                      category.menu_category_id,
                                  ),
                              )
                              .map((category) => category.category_name)
                              .join(", ")}`
                        : "All menus"}
                </h1>

                {noMenus ? (
                    <div className="text-center text-gray-600 mb-4">
                        No menus found for the selected filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {menus.map((menu) => (
                            <MenuCard
                                key={menu.id}
                                id={menu.id}
                                title={menu.title}
                                categoryName={menu.categoryname}
                                content={menu.menucontent}
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-red-500 mb-4">Error: {error}</div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
