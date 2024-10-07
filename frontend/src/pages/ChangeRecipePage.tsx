import React, { useState, useEffect, useCallback } from "react";
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

  // Функція для отримання деталей рецепта та всіх доступних інгредієнтів
  const fetchRecipeDetails = useCallback(async () => {
    try {
      // Виконуємо паралельні запити до API для отримання рецепта та інгредієнтів
      const [recipeResponse, ingredientsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/recipe/${id}`),
        axios.get("http://localhost:8080/api/ingredients"),
      ]);

      const recipeData: Recipe = recipeResponse.data;

      // Встановлюємо отримані дані в стан
      setRecipe(recipeData);
      setTitle(recipeData.title);
      setContent(recipeData.content);
      setSelectedIngredients(
        recipeData.ingredients.map((ing: Ingredient) => ing.id)
      );
      setAllIngredients(ingredientsResponse.data);
    } catch (error: unknown) {
      // Обробка помилок
      if (axios.isAxiosError(error)) {
        setError(
          error.response ? error.response.data.error : "Невідома помилка"
        );
      } else {
        setError("Невідома помилка");
      }
    }
  }, [id]); // Додаємо `id` в залежності

  useEffect(() => {
    // Викликаємо функцію для отримання деталей рецепта при завантаженні компонента
    fetchRecipeDetails();
  }, [fetchRecipeDetails]); // Додаємо `fetchRecipeDetails` в залежності

  // Функція для обробки вибору інгредієнтів
  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients(
      (prevSelected) =>
        prevSelected.includes(ingredientId)
          ? prevSelected.filter((id) => id !== ingredientId) // Вилучаємо інгредієнт, якщо він вже вибраний
          : [...prevSelected, ingredientId] // Додаємо інгредієнт, якщо він не вибраний
    );
  };

  // Функція для оновлення рецепта
  const handleUpdateRecipe = async () => {
    // Перевірка на заповненість полів
    if (!title.trim() || !content.trim() || selectedIngredients.length === 0) {
      setError("Усі поля повинні бути заповнені!");
      return; // Завершуємо функцію, якщо є пусті поля
    }

    // Фільтруємо недійсні інгредієнти
    const validIngredients = selectedIngredients.filter((id) => id != null);

    // Створюємо об'єкт для оновлення рецепта
    const updatedRecipe = {
      title,
      content,
      ingredients: validIngredients,
    };

    // Виводимо оновлений об'єкт в консоль перед відправленням
    console.log("Оновлений рецепт:", updatedRecipe);

    try {
      // Відправляємо PUT запит для оновлення рецепта
      await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Перенаправляємо користувача на головну сторінку після успішного оновлення
      navigate(`/main`);
    } catch (error: unknown) {
      // Обробка помилок
      if (axios.isAxiosError(error)) {
        setError(
          error.response ? error.response.data.error : "Невідома помилка"
        );
      } else {
        setError("Невідома помилка");
      }
    }
  };

  // Якщо рецепта або інгредієнтів ще немає, показуємо повідомлення про завантаження
  if (!recipe || allIngredients.length === 0) {
    return <div>Завантаження...</div>; // Повідомлення про завантаження
  }

  return (
    <>
      <Header /> {/* Шапка сторінки */}
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Змінити рецепт
        </h1>
        <form className="space-y-4">
          {/* Поле для назви рецепта */}
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

          {/* Поле для опису рецепта */}
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

          {/* Кнопки вибору інгредієнтів */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Інгредієнти
            </label>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-500 text-white" // Стиль для вибраного інгредієнта
                      : "bg-gray-200 text-gray-700" // Стиль для невибраного інгредієнта
                  }`}
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          </div>

          {/* Виведення помилки, якщо вона є */}
          {error && <div className="text-red-500 font-medium">{error}</div>}

          {/* Кнопка для оновлення рецепта */}
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
