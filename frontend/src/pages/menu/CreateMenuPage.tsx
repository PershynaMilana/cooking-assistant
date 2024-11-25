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

    // Получение списка категорий меню
    const fetchCategories = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:8080/api/menu-categories", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setCategories(response.data);
        } catch (error: unknown) {
            console.error("Ошибка при получении категорий:", error);
        }
    };

    // Получение списка рецептов
    const fetchRecipes = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:8080/api/recipes", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setAllRecipes(response.data);
        } catch (error: unknown) {
            console.error("Ошибка при получении рецептов:", error);
        }
    };

    useEffect(() => {
        fetchCategories(); // Загружаем категории меню
        fetchRecipes(); // Загружаем рецепты
    }, []);

    // Валидация формы
    const validateForm = () => {
        let valid = true;

        if (!menuTitle.trim()) {
            setMenuTitleError("Назва меню не може бути порожньою");
            valid = false;
        } else {
            setMenuTitleError(null);
        }

        if (!menuDescription.trim()) {
            setMenuDescriptionError("Опис меню не може бути порожнім");
            valid = false;
        } else {
            setMenuDescriptionError(null);
        }

        if (!selectedCategory) {
            setCategoryError("Виберіть категорію меню");
            valid = false;
        } else {
            setCategoryError(null);
        }

        if (selectedRecipes.length === 0) {
            setRecipesError("Виберіть хоча б один рецепт");
            valid = false;
        } else {
            setRecipesError(null);
        }

        return valid;
    };

    // Создание меню
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
            console.error("Ошибка при создании меню:", error);
        }
    };

    // Обработка кликов по рецептам
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
                    Додати нове меню
                </h1>
                <form className="space-y-4">
                    {/* Название меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Назва меню</label>
                        <input
                            type="text"
                            value={menuTitle}
                            onChange={(e) => setMenuTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuTitleError && <div className="text-red-500 text-sm mt-1">{menuTitleError}</div>}
                    </div>

                    {/* Описание меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Опис меню</label>
                        <textarea
                            value={menuDescription}
                            onChange={(e) => setMenuDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {menuDescriptionError && <div className="text-red-500 text-sm mt-1">{menuDescriptionError}</div>}
                    </div>

                    {/* Категория меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Категорія меню</label>
                        <select
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>
                                Оберіть категорію меню
                            </option>
                            {categories.map((category) => (
                                <option key={category.menu_category_id} value={category.menu_category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {categoryError && <div className="text-red-500 text-sm mt-1">{categoryError}</div>}
                    </div>

                    {/* Рецепты */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Рецепти</label>
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

                    {/* Кнопка создания меню */}
                    <div>
                        <button
                            type="button"
                            onClick={handleCreateMenu}
                            className="w-full py-2 bg-green-500 text-white rounded-md"
                        >
                            Створити меню
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMenuPage;
