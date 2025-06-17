import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header.tsx";
import { jwtDecode } from "jwt-decode";

interface Recipe {
    id: number;
    title: string;
}

interface MenuCategory {
    menu_category_id: number;
    category_name: string;
}

const CreateMenuPage: React.FC = () => {
    const [menuTitle, setMenuTitle] = useState("");
    const [menuDescription, setMenuDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

    const [menuTitleError, setMenuTitleError] = useState<string | null>(null);
    const [menuDescriptionError, setMenuDescriptionError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [recipesError, setRecipesError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Fetch menu categories
    const fetchCategories = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:8080/api/menu-categories", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setCategories(response.data);
        } catch (error: unknown) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch recipes
    const fetchRecipes = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:8080/api/recipes", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setAllRecipes(response.data);
        } catch (error: unknown) {
            console.error("Error fetching recipes:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchRecipes();
    }, []);

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

    // Create menu
    const handleCreateMenu = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No auth token found.");
            return;
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;

        try {
            const data = {
                menuTitle: menuTitle,
                menuContent: menuDescription,
                categoryId: selectedCategory,
                personId: userId,
                recipeIds: selectedRecipes,
            };

            await axios.post("http://localhost:8080/api/create-menu", data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/menu");
        } catch (error: unknown) {
            console.error("Error creating menu:", error);
        }
    };

    // Handle recipe selection
    const toggleRecipeSelection = (recipeId: number) => {
        setSelectedRecipes((prevSelected) => {
            if (prevSelected.includes(recipeId)) {
                return prevSelected.filter((id) => id !== recipeId);
            } else {
                return [...prevSelected, recipeId];
            }
        });
    };

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    Add New Menu
                </h1>
                <form className="space-y-4">
                    {/* Menu title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu title</label>
                        <input
                            type="text"
                            value={menuTitle}
                            onChange={(e) => setMenuTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuTitleError && <div className="text-red-500 text-sm mt-1">{menuTitleError}</div>}
                    </div>

                    {/* Menu description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu description</label>
                        <textarea
                            value={menuDescription}
                            onChange={(e) => setMenuDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuDescriptionError && <div className="text-red-500 text-sm mt-1">{menuDescriptionError}</div>}
                    </div>

                    {/* Menu category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Menu category</label>
                        <select
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(Number(e.target.value))}
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
                        {categoryError && <div className="text-red-500 text-sm mt-1">{categoryError}</div>}
                    </div>

                    {/* Recipes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recipes</label>
                        <div className="flex flex-wrap gap-2">
                            {allRecipes.map((recipe) => (
                                <button
                                    key={recipe.id}
                                    type="button"
                                    onClick={() => toggleRecipeSelection(recipe.id)}
                                    className={`py-2 px-4 border rounded-md ${
                                        selectedRecipes.includes(recipe.id) ? "bg-blue-500 text-white" : "bg-white"
                                    }`}
                                >
                                    {recipe.title}
                                </button>
                            ))}
                        </div>
                        {recipesError && <div className="text-red-500 text-sm mt-1">{recipesError}</div>}
                    </div>

                    {/* Create menu button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleCreateMenu}
                            className="w-full py-2 bg-green-500 text-white rounded-md"
                        >
                            Create Menu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMenuPage;
