import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header.tsx";
import { getMenuById, updateMenu } from "../../api/menusApi.ts";
import { getMenuCategories } from "../../api/menuCategoriesApi.ts";
import { getRecipes } from "../../api/recipesApi.ts";
import type { MenuCategory } from "../../types/menu.ts";
import type { RecipeListItem } from "../../types/recipe.ts";

const UpdateMenuPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [menuTitle, setMenuTitle] = useState("");
    const [menuDescription, setMenuDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [allRecipes, setAllRecipes] = useState<RecipeListItem[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuTitleError, setMenuTitleError] = useState<string | null>(null);
    const [menuDescriptionError, setMenuDescriptionError] = useState<
        string | null
    >(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [recipesError, setRecipesError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuDetails = async () => {
            if (!id) return;
            try {
                const data = await getMenuById(id);
                const { menu, recipes } = data;

                setMenuTitle(menu.title || "");
                setMenuDescription(menu.menucontent || "");
                setSelectedCategory(menu.categoryid || null);

                setSelectedRecipes(recipes.map((recipe) => recipe.id) || []);
            } catch (error: unknown) {
                console.error("Error fetching menu data:", error);
                setError("Failed to load menu data. Please try again later.");
            }
        };

        const fetchCategoriesAndRecipes = async () => {
            try {
                const [categoriesData, recipesData] = await Promise.all([
                    getMenuCategories(),
                    getRecipes(),
                ]);

                console.log(categoriesData);

                setCategories(categoriesData);
                setAllRecipes(recipesData);
            } catch (error: unknown) {
                console.error("Error loading categories or recipes:", error);
                setError("Failed to load categories or recipes.");
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchCategoriesAndRecipes(),
                fetchMenuDetails(),
            ]);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    // form validation
    const validateForm = () => {
        let valid = true;

        if (!menuTitle.trim()) {
            setMenuTitleError("Menu title cannot be empty.");
            valid = false;
        } else {
            setMenuTitleError(null);
        }

        if (!menuDescription.trim()) {
            setMenuDescriptionError("Menu description cannot be empty.");
            valid = false;
        } else {
            setMenuDescriptionError(null);
        }

        if (!selectedCategory) {
            setCategoryError("Please select a menu category.");
            valid = false;
        } else {
            setCategoryError(null);
        }

        if (selectedRecipes.length === 0) {
            setRecipesError("Please select at least one recipe.");
            valid = false;
        } else {
            setRecipesError(null);
        }

        return valid;
    };

    // update menu
    const handleUpdateMenu = async () => {
        if (!validateForm()) return;

        if (!localStorage.getItem("authToken")) {
            console.error("Authentication token not found.");
            return;
        }

        if (!id) return;

        try {
            const data = {
                menuTitle,
                menuContent: menuDescription,
                categoryId: selectedCategory,
                recipeIds: selectedRecipes,
            };
            console.log(data);

            await updateMenu(id, data);

            navigate("/menu");
        } catch (error: unknown) {
            console.error("Error updating menu:", error);
            setError("Failed to update menu. Please try again later.");
        }
    };

    // handle recipe selection
    const toggleRecipeSelection = (recipeId: number) => {
        setSelectedRecipes((prevSelected) =>
            prevSelected.includes(recipeId)
                ? prevSelected.filter((id) => id !== recipeId)
                : [...prevSelected, recipeId],
        );
    };

    // UI while loading data
    if (loading) {
        return <div>Loading data...</div>;
    }

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    Edit Menu
                </h1>
                <form className="space-y-4">
                    {/* Menu title */}
                    <div>
                        <label
                            htmlFor="edit-menu-title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Menu title
                        </label>
                        <input
                            id="edit-menu-title"
                            type="text"
                            value={menuTitle}
                            onChange={(e) => {
                                setMenuTitle(e.target.value);
                                validateForm();
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuTitleError && (
                            <div className="text-red-500 text-sm">
                                {menuTitleError}
                            </div>
                        )}
                    </div>

                    {/* Menu description */}
                    <div>
                        <label
                            htmlFor="edit-menu-description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Menu description
                        </label>
                        <textarea
                            id="edit-menu-description"
                            value={menuDescription}
                            onChange={(e) => {
                                setMenuDescription(e.target.value);
                                validateForm();
                            }}
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuDescriptionError && (
                            <div className="text-red-500 text-sm">
                                {menuDescriptionError}
                            </div>
                        )}
                    </div>

                    {/* Menu category */}
                    <div>
                        <label
                            htmlFor="edit-menu-category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Menu category
                        </label>
                        <select
                            id="edit-menu-category"
                            value={selectedCategory || ""}
                            onChange={(e) => {
                                setSelectedCategory(Number(e.target.value));
                                validateForm();
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>
                                Select a menu category
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.menu_category_id}
                                    value={category.menu_category_id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {categoryError && (
                            <div className="text-red-500 text-sm">
                                {categoryError}
                            </div>
                        )}
                    </div>

                    {/* Recipes */}
                    <div>
                        <p className="block text-sm font-medium text-gray-700">
                            Recipes
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {allRecipes.map((recipe) => (
                                <button
                                    type="button"
                                    key={recipe.id}
                                    onClick={() =>
                                        toggleRecipeSelection(recipe.id)
                                    }
                                    className={`py-2 px-4 border rounded-md ${
                                        selectedRecipes.includes(recipe.id)
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    {recipe.title}
                                </button>
                            ))}
                        </div>
                        {recipesError && (
                            <div className="text-red-500 text-sm">
                                {recipesError}
                            </div>
                        )}
                    </div>

                    {/* Update menu button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleUpdateMenu}
                            className="w-full py-2 px-4 bg-green-500 text-white rounded-full"
                        >
                            Update Menu
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="text-red-500 text-sm mt-4">{error}</div>
                )}
            </div>
        </div>
    );
};

export default UpdateMenuPage;
