import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../components/Header.tsx";

interface RecipeType {
  type_name: string;
  description: string;
}

const EditRecipeType: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [typeData, setTypeData] = useState<RecipeType>({
    type_name: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    type_name?: string;
    description?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true); // Стан для завантаження даних

  // Використовуємо useCallback для оптимізації fetchRecipeType
  const fetchRecipeType = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!id) return; // Перевіряємо, чи існує id
    try {
      const response = await axios.get<RecipeType>(
        `http://localhost:8080/api/recipe-type/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
            },
          }
      );
      setTypeData(response.data);
      //? console.log(response.data); для логу дати рецепта, зараз не потрібно
      setIsLoading(false); // Дані завантажені, знімаємо стан завантаження
    } catch (error) {
      console.error("Помилка завантаження типу рецепта", error);
      setIsLoading(false);
    }
  }, [id]);

  // Використовуємо useEffect для завантаження даних
  useEffect(() => {
    fetchRecipeType();
  }, [fetchRecipeType]); // Додаємо fetchRecipeType залежно

  // Обробник зміни введення
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTypeData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Обробник відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { type_name?: string; description?: string } = {};
    if (!typeData.type_name) {
      newErrors.type_name = "Заповніть поле";
    }
    if (!typeData.description) {
      newErrors.description = "Заповніть поле";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");  // Получаем токен из localStorage

      // Надсилаємо запит на сервер з токеном в заголовку
      await axios.put(
          `http://localhost:8080/api/recipe-type/${id}`,
          typeData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
            },
          }
      );

     // alert("Тип рецепта успешно обновлен");
      window.location.href = "/types";  // Перенаправление на страницу типов
    } catch (error) {
      console.error("Ошибка при обновлении типа рецепта:", error);  // Логирование ошибки
    }

  };

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Редагування типу рецепта
        </h1>
        {isLoading ? (
          <p>Завантаження...</p>
        ) : (
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
              Зберегти
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default EditRecipeType;
