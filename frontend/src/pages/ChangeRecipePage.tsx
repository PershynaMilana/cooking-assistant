import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.tsx";

interface Ingredient {
  id: number;
  name: string;
}

interface Recipe {
  title: string;
  content: string;
  ingredients: Ingredient[];
}

const ChangeRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Получаем детали рецепта и все доступные ингредиенты
  const fetchRecipeDetails = async () => {
    try {
      const [recipeResponse, ingredientsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/recipe/${id}`),
        axios.get("http://localhost:8080/api/ingredients"),
      ]);

      const recipeData: Recipe = recipeResponse.data;

      setRecipe(recipeData);
      setTitle(recipeData.title);
      setContent(recipeData.content);
      setSelectedIngredients(
        recipeData.ingredients.map((ing: Ingredient) => ing.id)
      );
      setAllIngredients(ingredientsResponse.data);
    } catch (error: any) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  // Обработка кликов по кнопкам ингредиентов
  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter((id) => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  // Обновление рецепта
  const handleUpdateRecipe = async () => {
    if (!title || !content || selectedIngredients.length === 0) {
      setError("Все поля должны быть заполнены!");
      return;
    }

    // Убираем все undefined значения из selectedIngredients
    const validIngredients = selectedIngredients.filter((id) => id != null);

    const updatedRecipe = {
      title,
      content,
      ingredients: validIngredients, // Используем отфильтрованный массив
    };

    // Выводим обновленный объект в консоль перед отправкой
    console.log("Обновленный рецепт:", updatedRecipe);

    try {
      await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate(`/main`);
    } catch (error: any) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!recipe || allIngredients.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Змінити рецепт
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Назва
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Опис
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>

          {/* Ингредиенты */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Інградієнти
            </label>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleUpdateRecipe}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Оновити
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangeRecipePage;
