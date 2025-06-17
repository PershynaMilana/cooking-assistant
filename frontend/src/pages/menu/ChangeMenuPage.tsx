import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header.tsx";

interface Recipe {
    id: number;
    title: string;
}

interface MenuCategory {
    menu_category_id: number;
    category_name: string;
}

const UpdateMenuPage: React.FC = () => {
    const { id } = useParams();
    const [menuTitle, setMenuTitle] = useState("");
    const [menuDescription, setMenuDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuTitleError, setMenuTitleError] = useState<string | null>(null);
    const [menuDescriptionError, setMenuDescriptionError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [recipesError, setRecipesError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Load menu data for editing
    const fetchMenuDetails = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get(`http://localhost:8080/api/menu/${id}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            const { menu, recipes } = response.data;

            setMenuTitle(menu.title || "");
            setMenuDescription(menu.menucontent || "");
            setSelectedCategory(menu.categoryid  || null);

            setSelectedRecipes(recipes.map((recipe: { id: any; }) => recipe.id) || []);
        } catch (error: unknown) {
            console.error("Error fetching menu data:", error);
            setError("Failed to load menu data. Please try again later.");
        }
    };

    // Load categories and recipes
    const fetchCategoriesAndRecipes = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const [categoriesResponse, recipesResponse] = await Promise.all([
                axios.get("http://localhost:8080/api/menu-categories", {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                }),
                axios.get("http://localhost:8080/api/recipes", {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                }),
            ]);

            console.log(categoriesResponse.data);

            setCategories(categoriesResponse.data);
            setAllRecipes(recipesResponse.data);
        } catch (error: unknown) {
            console.error("Error loading categories or recipes:", error);
            setError("Failed to load categories or recipes.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchCategoriesAndRecipes(), fetchMenuDetails()]);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    // Form validation
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

    // Update menu
    const handleUpdateMenu = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Authentication token not found.");
            return;
        }

        try {
            const data = {
                menuTitle,
                menuContent: menuDescription,
                categoryId: selectedCategory,
                recipeIds: selectedRecipes,
            };
            console.log(data);

            await axios.put(`http://localhost:8080/api/menu/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/menu");
        } catch (error: unknown) {
            console.error("Error updating menu:", error);
            setError("Failed to update menu. Please try again later.");
        }
    };

    // Handle recipe selection
    const toggleRecipeSelection = (recipeId: number) => {
        setSelectedRecipes((prevSelected) =>
            prevSelected.includes(recipeId)
                ? prevSelected.filter((id) => id !== recipeId)
                : [...prevSelected, recipeId]
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
                        <label className="block text-sm font-medium text-gray-700">Menu title</label>
                        <input
                            type="text"
                            value={menuTitle}
                            onChange={(e) => {
                                setMenuTitle(e.target.value);
                                validateForm();
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuTitleError && <div className="text-red-500 text-sm">{menuTitleError}</div>}
                    </div>

                    {/* Menu description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu description</label>
                        <textarea
                            value={menuDescription}
                            onChange={(e) => {
                                setMenuDescription(e.target.value);
                                validateForm();
                            }}
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuDescriptionError && <div className="text-red-500 text-sm">{menuDescriptionError}</div>}
                    </div>

                    {/* Menu category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu category</label>
                        <select
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
                                <option key={category.menu_category_id} value={category.menu_category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {categoryError && <div className="text-red-500 text-sm">{categoryError}</div>}
                    </div>

                    {/* Recipes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recipes</label>
                        <div className="flex flex-wrap gap-2">
                            {allRecipes.map((recipe) => (
                                <button
                                    type="button"
                                    key={recipe.id}
                                    onClick={() => toggleRecipeSelection(recipe.id)}
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
                        {recipesError && <div className="text-red-500 text-sm">{recipesError}</div>}
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

                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default UpdateMenuPage;
