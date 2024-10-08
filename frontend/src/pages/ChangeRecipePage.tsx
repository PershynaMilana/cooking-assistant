import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface Recipe {
  title: string;
  content: string;
  ingredients: Ingredient[];
  type_id: number; // Добавлено поле для типа рецепта
}

const ChangeRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [allTypes, setAllTypes] = useState<RecipeType[]>([]); // Для хранения типов рецептов
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); // Для хранения выбранного типа рецепта
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Функция для получения деталей рецепта, всех доступных ингредиентов и типов рецептов
  const fetchRecipeDetails = useCallback(async () => {
    try {
      const [recipeResponse, ingredientsResponse, typesResponse] =
        await Promise.all([
          axios.get(`http://localhost:8080/api/recipe/${id}`),
          axios.get("http://localhost:8080/api/ingredients"),
          axios.get("http://localhost:8080/api/recipe-types"), // Получаем типы рецептов
        ]);

      const recipeData: Recipe = recipeResponse.data;

      setRecipe(recipeData);
      setTitle(recipeData.title);
      setContent(recipeData.content);
      setSelectedIngredients(
        recipeData.ingredients.map((ing: Ingredient) => ing.id)
      );
      setAllIngredients(ingredientsResponse.data);
      setAllTypes(typesResponse.data); // Сохраняем типы в состояние
      setSelectedTypeId(recipeData.type_id); // Устанавливаем выбранный тип рецепта
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response ? error.response.data.error : "Невідома помилка"
        );
      } else {
        setError("Невідома помилка");
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  const toggleIngredientSelection = (ingredientId: number) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter((id) => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  const handleUpdateRecipe = async () => {
    // Сброс ошибок
    setIngredientError(null);
    setTypeError(null);

    // Валидация формы
    if (!title.trim()) {
      setError("Назва рецепта не може бути порожньою");
      return;
    }
    if (!content.trim()) {
      setError("Опис рецепта не може бути порожнім");
      return;
    }
    if (selectedIngredients.length === 0) {
      setIngredientError("Виберіть принаймні один інгредієнт");
      return;
    }
    if (selectedTypeId === null) {
      setTypeError("Виберіть тип рецепта");
      return;
    }

    const validIngredients = selectedIngredients.filter((id) => id != null);

    const updatedRecipe = {
      title,
      content,
      ingredients: validIngredients,
      type_id: selectedTypeId, // Добавляем выбранный тип рецепта
    };

    console.log("Оновлений рецепт:", updatedRecipe);

    try {
      await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate(`/main`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Проверка на ошибку внешнего ключа
        if (
          error.response &&
          error.response.data.error.includes("foreign key constraint")
        ) {
          setError("Оберіть тип рецепту");
        } else {
          setError(
            error.response ? error.response.data.error : "Невідома помилка"
          );
        }
      } else {
        setError("Невідома помилка");
      }
    }
  };

  if (!recipe || allIngredients.length === 0 || allTypes.length === 0) {
    return <div>Завантаження...</div>;
  }

  return (
    <>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          Змінити рецепт
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
              onChange={(e) => setSelectedTypeId(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              required // добавляем обязательность выбора
            >
              {allTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
            {typeError && <div className="text-red-500">{typeError}</div>}
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
                  className={`px-4 py-2 rounded-md ${
                    selectedIngredients.includes(ingredient.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => toggleIngredientSelection(ingredient.id)}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
            {ingredientError && (
              <div className="text-red-500">{ingredientError}</div>
            )}
          </div>

          {error && <div className="text-red-500 font-medium">{error}</div>}

          <div>
            <button
              type="button"
              onClick={handleUpdateRecipe}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Оновити
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangeRecipePage;
