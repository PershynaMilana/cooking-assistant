import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.tsx";

interface Ingredient {
  id: number;
  name: string;
}

interface RecipeType {
  id: number;
  type_name: string;
}

interface Recipe {
  title: string;
  content: string;
  ingredients: string[];
  type_id: number;
  cooking_time: number;
}

const ChangeRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Отримуємо id з URL
  const [recipe, setRecipe] = useState<Recipe | null>(null); // Стан для рецепта
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]); // Усі доступні інгредієнти
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]); // Усі доступні типи рецептів
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]); // Вибрані інгредієнти
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); // Вибраний тип рецепта
  const [title, setTitle] = useState(""); // Назва рецепта
  const [content, setContent] = useState(""); // Опис рецепта
  const [cookingTime, setCookingTime] = useState(""); // Стан для часу приготування
  const [error, setError] = useState<string | null>(null); // Загальні помилки
  const [ingredientError, setIngredientError] = useState<string | null>(null); // Помилка вибору інгредієнтів
  const [typeError, setTypeError] = useState<string | null>(null); // Помилка вибору типу рецепта
  const [cookingTimeError, setCookingTimeError] = useState<string | null>(null); // Помилка для часу приготування
  const navigate = useNavigate(); // Хук для навігації

  //? Функція для отримання деталей рецепту, всіх доступних інгредієнтів та типів рецептів
  const fetchRecipeDetails = useCallback(async () => {
    try {
      const [recipeResponse, ingredientsResponse, typesResponse] =
        await Promise.all([
          axios.get(`http://localhost:8080/api/recipe/${id}`),
          axios.get("http://localhost:8080/api/ingredients"),
          axios.get("http://localhost:8080/api/recipe-types"),
        ]);

      const recipeData: Recipe = recipeResponse.data;

      setRecipe(recipeData);
      setTitle(recipeData.title);
      setContent(recipeData.content);

      const existingIngredients = recipeData.ingredients
        .map((name: string) => {
          const ingredient = ingredientsResponse.data.find(
            (ing: Ingredient) => ing.name === name
          );
          return ingredient ? ingredient.id : null;
        })
        .filter((id): id is number => id !== null);

      // Сортуємо інгредієнти за алфавітом перед встановленням у стан
      const sortedIngredients = ingredientsResponse.data.sort(
        (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name)
      );

      setSelectedIngredients(existingIngredients);
      setAllIngredients(sortedIngredients); // Встановлюємо відсортовані інгредієнти
      setAllTypes(typesResponse.data);
      setSelectedTypeId(recipeData.type_id);
      setCookingTime(formatCookingTime(recipeData.cooking_time));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response ? error.response.data.error : "Невідома помилка"
        );
      } else {
        setError("Невідома помилка");
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  //? Функція для форматування часу приготування з хвилин до формату годгод:хвхв
  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`; // Формуємо як годгод:хвхв
  };

  //? Функція перемикання вибору інгредієнта
  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients(
      (prevSelected) =>
        prevSelected.includes(ingredientId)
          ? prevSelected.filter((id) => id !== ingredientId) // Видаляємо вибраний інгредієн
          : [...prevSelected, ingredientId] // Додаємо інгредієнт
    );
  };

  //? Функція оновлення рецепта
  const handleUpdateRecipe = async () => {
    setError(null);
    setIngredientError(null);
    setTypeError(null);
    setCookingTimeError(null);

    // Валідація форми
    if (!title.trim()) {
      setError("Назва рецепта не може бути порожньою");
      return;
    }
    if (!content.trim()) {
      setError("Опис рецепта не може бути порожнім");
      return;
    }
    if (selectedIngredients.length === 0) {
      setIngredientError("Виберіть принаймні один інгредієнт");
      return;
    }
    if (selectedTypeId === null) {
      setTypeError("Виберіть тип рецепта");
      return;
    }

    // Валідація часу приготування
    const timeParts = cookingTime.split(":");
    if (timeParts.length !== 2) {
      setCookingTimeError("Введіть час у форматі годгод:хвхв або 0:хвхв.");
      return;
    } else {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 99 ||
        minutes < 0 ||
        minutes >= 60
      ) {
        setCookingTimeError("Введіть у коректній формі, будь ласка.");
        return;
      }
    }

    const validIngredients = selectedIngredients.filter((id) => id != null);

    const updatedRecipe = {
      title,
      content,
      ingredients: validIngredients,
      type_id: selectedTypeId, // Додаємо обраний тип рецепту
      cooking_time:
        (parseInt(timeParts[0], 10) || 0) * 60 +
        (parseInt(timeParts[1], 10) || 0), // Перетворимо час на хвилины
    };

    //* console.log("Оновлений рецепт:", updatedRecipe);

    try {
      await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
        headers: {
          "Content-Type": "application/json", // Вказується тип контенту
        },
      });

      navigate(`/main`); // Перенаправляємо на головну сторінку після успішного оновлення
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Перевірка на помилку зовнішнього ключа
        if (
          error.response &&
          error.response.data.error.includes("foreign key constraint")
        ) {
          setError("Оберіть тип рецепту");
        } else {
          setError(
            error.response ? error.response.data.error : "Невідома помилка"
          );
        }
      } else {
        setError("Невідома помилка");
      }
    }
  };

  // Якщо рецепт чи дані ще не завантажені
  if (!recipe || allIngredients.length === 0 || allTypes.length === 0) {
    return <div>Завантаження...</div>;
  }

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Змінити рецепт
        </h1>
        <form className="space-y-4">
          {/* Назва рецепта */}
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

          {/* Опис рецепта */}
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

          {/* Час приготування */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Час приготування (годгод:хвхв)
            </label>
            <input
              type="text"
              placeholder="наприклад, 1:30 або 0:10"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {cookingTimeError && (
              <div className="text-red-500">{cookingTimeError}</div>
            )}
          </div>

          {/* Тип рецепта */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип рецепта
            </label>
            <select
              value={selectedTypeId ?? ""}
              onChange={(e) => setSelectedTypeId(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              required // Додаємо обов'язковість вибору
            >
              <option value="" disabled>
                Оберіть тип рецепту
              </option>
              {/* Опції типів рецептів */}
              {allTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
            {typeError && <div className="text-red-500">{typeError}</div>}
          </div>

          {/* Інгредієнти */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Інгредієнти
            </label>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`py-2 px-4 rounded-full ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-500 text-white" // Вибраний інгредієнт
                      : "bg-gray-200 text-gray-700" // Невибраний інгредієнт
                  }`}
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
            {ingredientError && (
              <div className="text-red-500">{ingredientError}</div>
            )}
          </div>

          {/* Відображення загальної помилки */}
          {error && <div className="text-red-500 font-medium">{error}</div>}

          {/* Кнопка оновлення рецепта */}
          <div>
            <button
              type="button"
              onClick={handleUpdateRecipe}
              className="bg-green-500 text-white py-2 px-4 rounded-full"
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
