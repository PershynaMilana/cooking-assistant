import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.tsx";

interface Ingredient {
  id: number;
  name: string;
}

const CreateRecipePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Отримання списку інгредієнтів
  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/ingredients");
      setAllIngredients(response.data);
    } catch (error: unknown) {
      // Заменили any на unknown
      setError((error as Error).message); // Обробка помилки
    }
  };

  useEffect(() => {
    fetchIngredients(); // Отримуємо інгредієнти при завантаженні сторінки
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
    if (!title.trim()) {
      setError("Назва рецепта не може бути порожньою"); // Перевірка назви
      return false;
    }
    if (!content.trim()) {
      setError("Опис рецепта не може бути порожнім"); // Перевірка опису
      return false;
    }
    if (selectedIngredients.length === 0) {
      setError("Виберіть принаймні один інгредієнт"); // Перевірка вибору інгредієнтів
      return false;
    }
    setError(null); // Скидаємо помилку, якщо валідація пройшла
    return true; // Валідація успішна
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
      // Заменили any на unknown
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
