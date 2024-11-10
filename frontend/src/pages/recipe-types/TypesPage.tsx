import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header.tsx";
import { Link } from "react-router-dom";

// Визначаємо інтерфейс для типу рецепту
interface RecipeType {
  id: number;
  type_name: string;
}

const TypesPage: React.FC = () => {
  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<RecipeType | null>(null);

  // Завантаження всіх типів рецептів
  useEffect(() => {
    fetchRecipeTypes();
  }, []);

  const fetchRecipeTypes = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get<RecipeType[]>(
        "http://localhost:8080/api/recipe-types",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
            },
          }
      );
      setRecipeTypes(response.data);
    } catch (error) {
      console.error("Помилка завантаження типів рецептів", error);
    }
  };

  const handleDeleteClick = (type: RecipeType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    if (selectedType) {
      try {
        await axios.delete(
          `http://localhost:8080/api/recipe-type/${selectedType.id}`,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
              },
            }
        );
        fetchRecipeTypes(); // Оновлення списку після видалення
        setIsModalOpen(false);
        setSelectedType(null);
      } catch (error) {
        console.error("Помилка видалення типу рецепта", error);
      }
    }
  };

  const handleEditClick = (type: RecipeType) => {
    // Перехід на сторінку редагування типу
    window.location.href = `/types/${type.id}`;
  };

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Типи рецептів
        </h1>
        <Link to="/add-type" className="font-montserratRegular text-l">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
            Додати
          </button>
        </Link>
        <ul>
          {recipeTypes.map((type) => (
            <li
              key={type.id}
              className="bg-gray-100 rounded-lg my-5 p-4 flex items-center justify-between"
            >
              {/* Назва типу рецепта */}
              <span className="text-left">{type.type_name}</span>

              {/* Контейнер для кнопок */}
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                  onClick={() => handleEditClick(type)}
                >
                  Змінити
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-full"
                  onClick={() => handleDeleteClick(type)}
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Модальне вікно підтвердження видалення */}
        {isModalOpen && selectedType && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">
                Ви впевнені, що хочете видалити тип "{selectedType.type_name}"?
                Усі рецепти цього типу також будуть видалені.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDeleteConfirm}
                >
                  Підтвердити
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TypesPage;
