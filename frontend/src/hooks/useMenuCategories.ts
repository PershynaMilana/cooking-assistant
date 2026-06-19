import { useEffect, useState } from "react";

import type { MenuCategory } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";

export const useMenuCategories = () => {
    const [categories, setCategories] = useState<MenuCategory[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMenuCategories();

                setCategories(data);
            } catch (err) {
                console.error("Error fetching menu categories.", err);
            }
        };

        void load();
    }, []);

    return { categories };
};
