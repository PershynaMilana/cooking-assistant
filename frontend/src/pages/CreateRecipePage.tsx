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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null); // Новое состояние для ошибки выбора типа
  const navigate = useNavigate();

  // Отримання списку інгредієнтів
  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/ingredients");
      setAllIngredients(response.data);
    } catch (error: unknown) {
      setError((error as Error).message); // Обробка помилки
    }
  };

  // Отримання списку типів рецептів
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

  // Обробка кліків по кнопках інгредієнтів
  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientId)) {
        return prevSelected.filter((id) => id !== ingredientId); // Убираємо вибраний інгредієнт
      } else {
        return [...prevSelected, ingredientId]; // Додаємо інгредієнт
      }
    });
  };

  // Валідація форми
  const validateForm = () => {
    let isValid = true; // Флаг для отслеживания валидности формы
    setError(null); // Сбрасываем ошибки
    setTypeError(null); // Сбрасываем ошибку типа

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

    return isValid; // Валідація успішна
  };

  // Відправка запиту на створення нового рецепта з використанням Axios
  const handleCreateRecipe = async () => {
    if (!validateForm()) return; // Перевіряємо валідацію

    try {
      // Формуємо JSON з даними
      const recipeData = {
        title: title,
        content: content,
        person_id: 1, // Змінити на актуальний ID
        ingredients: selectedIngredients, // Передаємо як масив чисел
        type_id: selectedTypeId, // Передаємо ID типу рецепта
      };
      console.log(recipeData); // Виводимо дані рецепта в консоль

      // Використовуємо Axios для відправки даних
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
              } // Установим null, если выбрана пустая строка
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              required
            >
              <option value="" disabled>
                Оберіть тип рецепту
              </option>{" "}
              {/* Опция по умолчанию */}
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

          {/* Відображення помилки */}
          {error && <div className="text-red-500">{error}</div>}

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
