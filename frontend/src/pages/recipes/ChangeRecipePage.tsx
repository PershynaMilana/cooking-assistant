import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header.tsx";

interface Ingredient {
  id: number;
  name: string;
  unit_name: string;
}

interface RecipeType {
  id: number;
  type_name: string;
}

interface Recipe {
  title: string;
  content: string;
  ingredients: {
    id: number;
    name: string;
    quantity_recipe_ingredients: number;
    unit_name: string;
  }[];
  type_id: number;
  cooking_time: number;
  servings: string;
}

const ChangeRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
      {
        id: number;
        name: string;
        quantity_recipe_ingredients: number;
        unit_name: string;
      }[]
  >([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookingTimeError, setCookingTimeError] = useState<string | null>(null);
  const [servings, setServings] = useState<string>("");

  const navigate = useNavigate();

  const fetchRecipeDetails = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const [recipeResponse, ingredientsResponse, typesResponse] =
          await Promise.all([
            axios.get(`http://localhost:8080/api/recipe/${id}`, {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            }),
            axios.get("http://localhost:8080/api/ingredients", {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            }),
            axios.get("http://localhost:8080/api/recipe-types", {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            }),
          ]);

      const recipeData: Recipe = recipeResponse.data;
      setTitle(recipeData.title);
      setContent(recipeData.content);
      setCookingTime(formatCookingTime(recipeData.cooking_time));
      setServings(recipeData.servings || "");
      setAllIngredients(ingredientsResponse.data);
      setAllTypes(typesResponse.data);
      setSelectedIngredients(recipeData.ingredients);
      setSelectedTypeId(recipeData.type_id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error loading recipe data, ${error.message}`);
      } else {
        setError("Unknown error while loading data.");
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const updateIngredientQuantity = (
      ingredientId: number,
      quantity_recipe_ingredients: number
  ) => {
    setSelectedIngredients((prev) =>
        prev.map((ingredient) =>
            ingredient.id === ingredientId
                ? {
                  ...ingredient,
                  quantity_recipe_ingredients: Math.max(
                      1,
                      quantity_recipe_ingredients
                  ),
                }
                : ingredient
        )
    );
  };

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
            quantity_recipe_ingredients: 1,
            unit_name: ingredient.unit_name,
          },
        ];
      }
    });
  };

  const handleUpdateRecipe = async () => {
    setError(null);
    setCookingTimeError(null);

    if (!servings.trim()) {
      setError("Servings cannot be empty.");
      return;
    }

    const timeParts = cookingTime.split(":");
    if (timeParts.length !== 2) {
      setCookingTimeError("Enter time in format hh:mm");
      return;
    }
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
      setCookingTimeError("Enter valid time in format hh:mm");
      return;
    }

    const updatedRecipe = {
      title,
      content,
      type_id: selectedTypeId,
      cooking_time: hours * 60 + minutes,
      servings,
      ingredients: selectedIngredients.map(
          ({ id, quantity_recipe_ingredients }) => ({
            id,
            quantity_recipe_ingredients,
          })
      ),
    };

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      navigate("/");
    } catch (error) {
      setError("Error updating recipe.");
    }
  };

  return (
      <div>
        <Header />
        <div className="mx-[15vw]">
          <h1 className="text-relative-h3 my-[7vh] font-bold">Edit Recipe</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Cooking Time (hh:mm)
              </label>
              <input
                  type="text"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {cookingTimeError && (
                  <div className="text-red-500">{cookingTimeError}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Recipe Type</label>
              <select
                  value={selectedTypeId ?? ""}
                  onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select recipe type
                </option>
                {allTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type_name}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Ingredients</label>
              <div className="flex flex-wrap gap-2">
                {allIngredients.map((ingredient) => (
                    <button
                        key={ingredient.id}
                        type="button"
                        onClick={() => toggleIngredientSelection(ingredient)}
                        className={`${
                            selectedIngredients.some((i) => i.id === ingredient.id)
                                ? "bg-green-500 text-white"
                                : "bg-gray-300"
                        } px-4 py-2 rounded-md`}
                    >
                      {ingredient.name}
                    </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mt-4">Selected Ingredients</h4>
              {selectedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center space-x-2">
                    <span>{ingredient.name}</span>
                    <input
                        type="number"
                        min={1}
                        value={ingredient.quantity_recipe_ingredients}
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
            <div>
              <label className="block text-sm font-medium">
                Servings (for which container the recipe is calculated):
              </label>
              <input
                  type="text"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="For example: 1 serving or full pot"
              />
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}
            <button
                type="button"
                onClick={handleUpdateRecipe}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Update Recipe
            </button>
          </form>
        </div>
      </div>
  );
};

export default ChangeRecipePage;
