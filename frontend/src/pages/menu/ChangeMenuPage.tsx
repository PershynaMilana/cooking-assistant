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

    // Загрузка данных меню для редактирования
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
            console.error("Ошибка при получении данных меню:", error);
            setError("Не удалось загрузить данные меню. Попробуйте позже.");
        }
    };

    // Загрузка категорий и рецептов
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

            console.log(categoriesResponse.data)

            setCategories(categoriesResponse.data);
            setAllRecipes(recipesResponse.data);
        } catch (error: unknown) {
            console.error("Ошибка при загрузке данных категорий или рецептов:", error);
            setError("Не удалось загрузить категории или рецепты.");
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

    // Обновление меню
    const handleUpdateMenu = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Токен аутентификации не найден.");
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
            console.error("Ошибка при обновлении меню:", error);
            setError("Не удалось обновить меню. Попробуйте позже.");
        }
    };

    // Обработка выбора рецептов
    const toggleRecipeSelection = (recipeId: number) => {
        setSelectedRecipes((prevSelected) =>
            prevSelected.includes(recipeId)
                ? prevSelected.filter((id) => id !== recipeId)
                : [...prevSelected, recipeId]
        );
    };

    // UI при загрузке данных
    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    Редагувати меню
                </h1>
                <form className="space-y-4">
                    {/* Название меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Назва меню</label>
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

                    {/* Описание меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Опис меню</label>
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

                    {/* Категория меню */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Категорія меню</label>
                        <select
                            value={selectedCategory || ""}
                            onChange={(e) => {
                                setSelectedCategory(Number(e.target.value));
                                validateForm();
                            }}
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
                        {categoryError && <div className="text-red-500 text-sm">{categoryError}</div>}
                    </div>

                    {/* Рецепты */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Рецепти</label>
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

                    {/* Кнопка для обновления меню */}
                    <div>
                        <button
                            type="button"
                            onClick={handleUpdateMenu}
                            className="w-full py-2 px-4 bg-green-500 text-white rounded-full"
                        >
                            Оновити меню
                        </button>
                    </div>
                </form>

                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default UpdateMenuPage;
