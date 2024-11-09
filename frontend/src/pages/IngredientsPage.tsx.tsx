import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

interface Ingredient {
  id: number;
  name: string;
}

const IngredientsPage: React.FC = () => {
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientToDelete, setSelectedIngredientToDelete] =
    useState<Ingredient | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/ingredients"
        );

        // Сортуємо інгредієнти в алфавітному порядку перед збереженням до стану
        const sortedIngredients = response.data.sort(
          (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name)
        );

        setAllIngredients(sortedIngredients);
      } catch (error) {
        console.error("Помилка завантаження інгредієнтів:", error);
      }
    };

    const fetchSelectedIngredients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/selected-ingredients"
        );
        setSelectedIngredients(
          response.data.map(
            (ingredient: { ingredient_id: number }) => ingredient.ingredient_id
          )
        );
      } catch (error) {
        console.error("Помилка завантаження вибраних інгредієнтів:", error);
      }
    };

    fetchIngredients();
    fetchSelectedIngredients();
  }, []);

  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const saveIngredients = async () => {
    try {
      await axios.put("http://localhost:8080/api/ingredients", {
        ingredients: selectedIngredients,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Помилка збереження інгредієнтів:", error);
    }
  };

  const confirmDeleteIngredient = (ingredient: Ingredient) => {
    setSelectedIngredientToDelete(ingredient);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedIngredientToDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/api/selected-ingredients/${selectedIngredientToDelete.id}`
        );
        setSelectedIngredients((prev) =>
          prev.filter((id) => id !== selectedIngredientToDelete.id)
        );
      } catch (error) {
        console.error("Помилка видалення інгредієнта:", error);
      }
    }
    setIsModalOpen(false);
    setSelectedIngredientToDelete(null);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Мої інгредієнти</h1>

        {!isEditing ? (
          <ul className="space-y-2">
            {selectedIngredients.length === 0 ? (
              <p className="text-center text-gray-600 mb-4">
                Наразі у вас немає жодних інгредієнтів.
              </p>
            ) : (
              allIngredients
                .filter((ingredient) =>
                  selectedIngredients.includes(ingredient.id)
                )
                .map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="bg-blue-200 rounded p-2 flex justify-between"
                  >
                    {ingredient.name}
                    <button
                      onClick={() => confirmDeleteIngredient(ingredient)}
                      className="bg-red-500 text-white py-2 px-4 rounded-full"
                    >
                      Видалити
                    </button>
                  </li>
                ))
            )}
          </ul>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2 mt-4">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                  className={`py-2 px-4 rounded-full ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-700 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (isEditing) {
              saveIngredients();
            }
            setIsEditing((prev) => !prev);
          }}
          className="mt-6 bg-green-500 text-white p-2 rounded-full block mx-auto"
        >
          {isEditing ? "Зберегти" : "Змінити інгредієнти"}
        </button>

        {/* Модальне вікно підтвердження видалення */}
        {isModalOpen && selectedIngredientToDelete && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4 text-center">
                Ви впевнені, що хочете видалити інгредієнт "
                {selectedIngredientToDelete.name}"?
              </p>
              <div className="flex justify-center space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full"
                  onClick={handleDeleteConfirm}
                >
                  Підтвердити
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
