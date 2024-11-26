import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header.tsx";
import { jwtDecode } from "jwt-decode";

interface Ingredient {
  id: number;
  name: string;
  unit_name: string; // Добавлено поле для единицы измерения
}

interface RecipeType {
  id: number;
  type_name: string;
}

interface SelectedIngredient {
  id: number;
  name: string;
  quantity: number;
  unit_name: string; // Добавлено поле для единицы измерения
}

const CreateRecipePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
      SelectedIngredient[]
  >([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [cookingTimeError, setCookingTimeError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchIngredients = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
          "http://localhost:8080/api/ingredients",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
      );
      const sortedIngredients = response.data.sort(
          (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name, "uk")
      );
      setAllIngredients(sortedIngredients);
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  const fetchRecipeTypes = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
          "http://localhost:8080/api/recipe-types",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
      );
      setAllTypes(response.data);
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchRecipeTypes();
  }, []);

  const toggleIngredientSelection = (ingredient: Ingredient) => {
    setSelectedIngredients((prevSelected) => {
      const existing = prevSelected.find((i) => i.id === ingredient.id);
      if (existing) {
        return prevSelected.filter((i) => i.id !== ingredient.id);
      } else {
        return [
          ...prevSelected,
          {
            id: ingredient.id,
            name: ingredient.name,
            quantity: 1,
            unit_name: ingredient.unit_name, // Добавляем единицу измерения
          },
        ];
      }
    });
  };

  const updateIngredientQuantity = (ingredientId: number, quantity: number) => {
    setSelectedIngredients((prevSelected) =>
        prevSelected.map((ingredient) =>
            ingredient.id === ingredientId
                ? { ...ingredient, quantity: Math.max(quantity, 1) }
                : ingredient
        )
    );
  };

  const validateForm = () => {
    let isValid = true;
    setError(null);
    setTypeError(null);
    setCookingTimeError(null);

    if (!title.trim()) {
      setError("Назва рецепта не може бути порожньою");
      isValid = false;
    }
    if (!content.trim()) {
      setError("Опис рецепта не може бути порожнім");
      isValid = false;
    }
    if (selectedIngredients.length === 0) {
      setError("Виберіть принаймні один інгредієнт");
      isValid = false;
    }
    if (selectedTypeId === null) {
      setTypeError("Оберіть тип рецепта");
      isValid = false;
    }

    const timeParts = cookingTime.split(":");
    if (timeParts.length !== 2) {
      setCookingTimeError("Введіть час у форматі годгод:хвхв або 0:хвхв.");
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
        setCookingTimeError("Введіть у коректній формі, будь ласка.");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleCreateRecipe = async () => {
    if (!validateForm()) return;

    const timeParts = cookingTime.split(":").map(Number);
    const totalCookingTime = (timeParts[0] || 0) * 60 + (timeParts[1] || 0);

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const recipeData = {
        title,
        content,
        person_id: userId,
        ingredients: selectedIngredients.map((ingredient) => ({
          id: ingredient.id,
          quantity: ingredient.quantity,
        })),
        type_id: selectedTypeId,
        cooking_time: totalCookingTime,
      };

      await axios.post("http://localhost:8080/api/recipe", recipeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      navigate("/");
    } catch (error: unknown) {
      setError((error as Error).message);
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
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                  required
              >
                <option value="" disabled>
                  Оберіть тип рецепту
                </option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Інгредієнти
              </label>
              <div className="flex flex-wrap gap-2">
                {allIngredients.map((ingredient) => (
                    <button
                        key={ingredient.id}
                        type="button"
                        onClick={() => toggleIngredientSelection(ingredient)}
                        className={`${
                            selectedIngredients.some((i) => i.id === ingredient.id)
                                ? "bg-green-500"
                                : "bg-gray-300"
                        } px-4 py-2 rounded-md`}
                    >
                      {ingredient.name}
                    </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mt-4">Обрані інгредієнти</h4>
              {selectedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center space-x-2">
                    <span>{ingredient.name}</span>
                    <input
                        type="number"
                        min={1}
                        value={ingredient.quantity}
                        onChange={(e) =>
                            updateIngredientQuantity(
                                ingredient.id,
                                parseInt(e.target.value, 10)
                            )
                        }
                        className="w-20 p-2 border border-gray-300 rounded-md"
                    />
                    <span className="text-gray-700">{ingredient.unit_name}</span>
                  </div>
              ))}
            </div>

            <button
                type="button"
                onClick={handleCreateRecipe}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Створити рецепт
            </button>
          </form>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
  );
};

export default CreateRecipePage;
