import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateRecipePage: React.FC = () => {
  const [title, setTitle] = useState(""); // Назва рецепта
  const [content, setContent] = useState(""); // Опис рецепта
  const [cookingTime, setCookingTime] = useState(""); // Стан для часу приготування
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]); // Всі доступні інгредієнти
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]); // Всі доступні типи рецептів
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]); // Вибрані інгредієнти
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); // Вибраний тип рецепта
  const [error, setError] = useState<string | null>(null); // Загальні помилки
  const [typeError, setTypeError] = useState<string | null>(null); // Помилка вибору типу
  const [cookingTimeError, setCookingTimeError] = useState<string | null>(null); // Помилка часу приготування
  const navigate = useNavigate(); // Хук для навігації

  //? Отримання списку інгредієнтів
  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/ingredients");
      const sortedIngredients = response.data.sort(
        (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name, "uk") // Сортуємо за ім'ям, враховуючи українську мову
      );
      setAllIngredients(sortedIngredients);
    } catch (error: unknown) {
      setError((error as Error).message); // Обробка помилки
    }
  };

  //? Отримання списку типів рецептів
  const fetchRecipeTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/recipe-types"
      );
      setAllTypes(response.data);
    } catch (error: unknown) {
      setError((error as Error).message); // Обробка помилки
    }
  };

  useEffect(() => {
    fetchIngredients(); // Отримуємо інгредієнти при завантаженні сторінки
    fetchRecipeTypes(); // Отримуємо типи рецептів
  }, []);

  //?  Обробка кліків по кнопках інгредієнтів
  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientId)) {
        return prevSelected.filter((id) => id !== ingredientId); // Видаляємо обраний інгредієнт
      } else {
        return [...prevSelected, ingredientId]; // Додаємо інгредієнт
      }
    });
  };

  //? Валідація форми
  const validateForm = () => {
    let isValid = true; // Флаг для відстеження валідності форми
    setError(null); // Скидаємо загальні помилки
    setTypeError(null); // Скидаємо помилку типу
    setCookingTimeError(null); // Скидаємо помилку часу приготування

    if (!title.trim()) {
      setError("Назва рецепта не може бути порожньою"); // Перевірка назви
      isValid = false;
    }
    if (!content.trim()) {
      setError("Опис рецепта не може бути порожнім"); // Перевірка опису
      isValid = false;
    }
    if (selectedIngredients.length === 0) {
      setError("Виберіть принаймні один інгредієнт"); // Перевірка вибору інгредієнтів
      isValid = false;
    }
    if (selectedTypeId === null) {
      setTypeError("Оберіть тип рецепта"); // Перевірка вибору типу
      isValid = false;
    }

    //? Валідація часу приготування
    const timeParts = cookingTime.split(":");
    if (timeParts.length !== 2) {
      setCookingTimeError("Введіть час у форматі годгод:хвхв або 0:хвхв."); // Помилка некоректного формату
      isValid = false;
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
        setCookingTimeError("Введіть у коректній формі, будь ласка."); // Помилка некоректного часу
        isValid = false;
      }
    }

    return isValid; // Валідація успішна
  };

  //? Надсилання запиту на створення нового рецепта з використанням Axios
  const handleCreateRecipe = async () => {
    if (!validateForm()) return; // Перевірка валідації

    const timeParts = cookingTime.split(":").map(Number);
    const totalCookingTime = (timeParts[0] || 0) * 60 + (timeParts[1] || 0); // Перетворюємо час у хвилини

    try {
      // Формуємо JSON з даними
      const recipeData = {
        title,
        content,
        person_id: 1, // Змінити на актуальний ID
        ingredients: selectedIngredients, // Передаємо як масив чисел
        type_id: selectedTypeId, // Передаємо ID типу рецепта
        cooking_time: totalCookingTime, // Передаємо cooking_time
      };
      //? console.log(recipeData); // Виводимо дані рецепта в консоль

      // Використовуємо Axios для надсилання даних
      await axios.post("http://localhost:8080/api/recipe", recipeData, {
        headers: {
          "Content-Type": "application/json", // Вказуємо тип контенту
        },
      });

      navigate("/"); // Перенаправляємо на головну сторінку після успішного створення
    } catch (error: unknown) {
      setError((error as Error).message); // Обробка помилки
    }
  };

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Додати новий рецепт
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип рецепта
            </label>
            <select
              value={selectedTypeId ?? ""}
              onChange={(e) =>
                setSelectedTypeId(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              } // Встановлюємо null, якщо обрана порожня строка
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              required
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
            {typeError && (
              <div className="text-red-500">Оберіть тип рецепту</div>
            )}
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
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                  className={`py-2 px-4 rounded-full ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-700 text-white" // Вибраний інгредієнт
                      : "bg-gray-300 text-black" // Невибраний інгредієнт
                  }`}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          </div>

          {/* Відображення загальної помилки */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Кнопка створення рецепта */}
          <button
            type="button"
            onClick={handleCreateRecipe}
            className="bg-green-500 text-white py-2 px-4 rounded-full"
          >
            Створити рецепт
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipePage;
