import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header.tsx";

interface RecipeType {
  type_name: string;
  description: string;
}

const AddRecipeType: React.FC = () => {
  // Використовуємо типізацію стану
  const [typeData, setTypeData] = useState<RecipeType>({
    type_name: "", // Ініціалізація поля назви
    description: "", // Ініціалізація поля опису
  });
  const [errors, setErrors] = useState<{
    type_name?: string; // Помилки для поля назви
    description?: string; // Помилки для поля опису
  }>({});

  // Обробник зміни введення
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTypeData((prevData) => ({ ...prevData, [name]: value })); // Оновлюємо стан
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Очищаємо помилки
  };

  // Обробник відправлення форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки

    // Перевірка, чи заповнені всі поля
    const newErrors: { type_name?: string; description?: string } = {};
    if (!typeData.type_name) {
      newErrors.type_name = "Заповніть поле"; // Помилка для назви
    }
    if (!typeData.description) {
      newErrors.description = "Заповніть поле"; // Помилка для опису
    }

    // Якщо є помилки, оновлюємо стан і виходимо з функції
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");  // Получаем токен из localStorage

      // Надсилаємо запит на сервер з токеном в заголовку
      await axios.post(
          "http://localhost:8080/api/recipe-types",
          typeData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
            },
          }
      );

      window.location.href = "/types"; // Перенаправление на страницу типов
    } catch (error) {
      console.error("Ошибка при добавлении типа рецепта:", error); // Логирование ошибки
    }

  };

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Додавання нового типу рецепта
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>
              Назва:
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                name="type_name"
                value={typeData.type_name}
                onChange={handleInputChange}
              />
            </label>
            {errors.type_name && (
              <div className="text-red-500">{errors.type_name}</div>
            )}
          </div>
          <div>
            <label>
              Опис:
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                name="description"
                value={typeData.description}
                onChange={handleInputChange}
              />
            </label>
            {errors.description && (
              <div className="text-red-500">{errors.description}</div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Додати
          </button>
        </form>
      </div>
    </>
  );
};

export default AddRecipeType;
