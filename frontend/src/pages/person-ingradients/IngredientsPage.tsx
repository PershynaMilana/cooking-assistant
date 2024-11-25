import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/Header.tsx";

interface Ingredient {
  id: number;
  name?: string | "";
  ingredient_name?: string;
  unit_name: string;
  quantity_person_ingradient: number;
}

interface AllIngredient {
  id: number;
  name: string;
}

const IngredientsPage: React.FC = () => {
  const [allIngredients, setAllIngredients] = useState<AllIngredient[]>([]);
  const [personIngredients, setPersonIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientToDelete, setSelectedIngredientToDelete] =
      useState<Ingredient | null>(null);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [updatedIngredients, setUpdatedIngredients] = useState<Ingredient[]>(
      []
  );

  // Fetch all ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found.");
        return;
      }

      try {
        const response = await axios.get(
            "http://localhost:8080/api/ingredients",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        const sortedIngredients = response.data.sort(
            (a: AllIngredient, b: AllIngredient) => a.name.localeCompare(b.name)
        );
        setAllIngredients(sortedIngredients);
      } catch (error) {
        console.error("Помилка при завантаженні інгредієнтів::", error);
      }
    };

    fetchIngredients();
  }, []);

  const fetchSelectedIngredients = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await axios.get(
          `http://localhost:8080/api/user-ingredients/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId },
          }
      );

      setPersonIngredients(
          response.data.map((item: any) => ({
            ...item,
            id: item.ingredient_id,
          }))
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

  // Виклик fetchSelectedIngredients під час монтування компонента (або на певному тригері)
  useEffect(() => {
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
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    // формуємо данні для отправки
    const ingredientsToSave = [
      ...updatedIngredients, // існуючі інградієнти з фї к-стью
      ...allIngredients
          .filter(
              (ingredient) =>
                  selectedIngredients.includes(ingredient.id) &&
                  !updatedIngredients.some((item) => item.id === ingredient.id)
          )
          .map((ingredient) => ({
            id: ingredient.id,
            ingredient_name: ingredient.name,
            quantity_person_ingradient: 1, //нові інградієнти завжди 1
          })),
    ];

    try {
      await axios.put(
          `http://localhost:8080/api/user-ingredients/${userId}`,
          { ingredients: ingredientsToSave },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId },
          }
      );
      setIsEditing(false);
      await fetchSelectedIngredients();
    } catch (error) {
      console.error("Помилка збереження інгредієнтів:", error);
    }
  };

  const toggleQuantityEdit = () => {
    setIsEditingQuantity((prev) => !prev);
    setIsEditing(false);
    setUpdatedIngredients([...personIngredients]);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setUpdatedIngredients((prev) =>
        prev.map((ingredient) =>
            ingredient.id === id
                ? { ...ingredient, quantity_person_ingradient: newQuantity }
                : ingredient
        )
    );
  };

  const saveUpdatedQuantities = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      await axios.put(
          `http://localhost:8080/api/user-ingredients/update-quantities/${userId}`,
          { updatedIngredients },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      setIsEditingQuantity(false);
      await fetchSelectedIngredients();
    } catch (error) {
      console.error("Помилка збереження кількостей:", error);
    }
  };

  const confirmDeleteIngredient = (ingredient: Ingredient) => {
    if (!ingredient.id) {
      console.error("Ідентифікатор інгредієнта відсутній:", ingredient);
      return;
    }
    setSelectedIngredientToDelete(ingredient);
    setIsModalOpen(true);
  };

  // видалення інградієнту
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedIngredientToDelete) {
      console.error("No auth token found or ingredient not selected.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      await axios.delete(
          `http://localhost:8080/api/user-ingredients/${userId}/${selectedIngredientToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      console.log(
          `http://localhost:8080/api/user-ingredients/${userId}/${selectedIngredientToDelete.id}`
      );
      setSelectedIngredients((prev) =>
          prev.filter((id) => id !== selectedIngredientToDelete.id)
      );
      // оновлюємо список інградієнтів
      await fetchSelectedIngredients();
    } catch (error) {
      console.error("Помилка видалення інгредієнта:", error);
    }

    setIsModalOpen(false);
    setSelectedIngredientToDelete(null);
  };

  return (
      <div>
        <Header />
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-6">Мої інгредієнти</h1>

          {/* Отображение текущих ингредиентов */}
          {!isEditingQuantity ? (
              !isEditing ? (
                  <ul className="space-y-2">
                    {personIngredients.length === 0 ? (
                        <p className="text-center text-gray-600 mb-4">
                          Наразі у вас немає жодних інгредієнтів.
                        </p>
                    ) : (
                        personIngredients.map((ingredient, index) => (
                            <li
                                key={ingredient.id || index}
                                className="bg-blue-200 rounded p-2 flex justify-between"
                            >
                              <div className="flex items-center">
                      <span className="font-medium">
                        {ingredient.ingredient_name}
                      </span>
                                <span className="ml-2 text-sm text-gray-700">
                        {ingredient.quantity_person_ingradient} -{" "}
                                  {ingredient.unit_name}
                      </span>
                              </div>
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
                  /* Режим выбора всех ингредиентов */
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
              )
          ) : null}

          {/* Режим редактування кількісті */}
          {isEditingQuantity && (
              <div>
                {updatedIngredients.map((ingredient) => (
                    <div
                        key={ingredient.id}
                        className="flex items-center justify-between mb-2"
                    >
                <span className="font-medium">
                  {ingredient.ingredient_name}
                </span>
                      <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            value={ingredient.quantity_person_ingradient}
                            onChange={(e) =>
                                handleQuantityChange(ingredient.id, +e.target.value)
                            }
                            className="border border-gray-300 rounded p-1 w-20 text-center"
                        />
                        <span className="text-gray-700">{ingredient.unit_name}</span>
                      </div>
                    </div>
                ))}
                <button
                    onClick={saveUpdatedQuantities}
                    className="bg-green-500 text-white py-2 px-4 rounded-full mt-4 block mx-auto"
                >
                  Зберегти кількість
                </button>
              </div>
          )}

          {!isEditingQuantity && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                    onClick={() => {
                      if (isEditing) {
                        saveIngredients();
                      }
                      setIsEditing((prev) => !prev);
                    }}
                    className="bg-green-500 text-white py-2 px-4 rounded-full"
                >
                  {isEditing ? "Зберегти" : "Змінити інгредієнти"}
                </button>
                {!isEditing && (
                    <button
                        onClick={toggleQuantityEdit}
                        className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                    >
                      Змінити кількість
                    </button>
                )}
              </div>
          )}

          {/* Модальне вікно підтвердження */}
          {isModalOpen && selectedIngredientToDelete && (
              <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="mb-4 text-center">
                    Ви впевнені, що хочете видалити інгредієнт "
                    {selectedIngredientToDelete?.ingredient_name}"?
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
