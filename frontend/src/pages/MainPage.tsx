import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Header from "../components/Header.tsx";
import SearchComponent from "../components/SearchComponent.tsx";
import RecipeTypeFilter from "../components/RecipeTypeFilter";
import axios from "axios";

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: string[];
  type_name: string;
  creation_date: string;
}

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

const MainPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [typesDescriptions, setTypesDescriptions] = useState<RecipeType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [noRecipes, setNoRecipes] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const ingredientName = searchParams.get("ingredient_name");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Функция для получения рецептов
  const fetchRecipes = useCallback(async () => {
    setError(null);
    setNoRecipes(false);
    setDateError(null);

    // Проверка на валидность дат
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError("Начальная дата не может быть позже конечной даты.");
      return;
    }

    // Проверка на будущее (если одна из дат в будущем)
    const today = new Date();
    if (new Date(startDate) > today || new Date(endDate) > today) {
      setDateError("Оберіть валідний проміжок часу.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/recipes-by-filters`,
        {
          params: {
            ingredient_name: ingredientName || "",
            type_ids:
              selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          },
        }
      );

      if (response.data.length === 0) {
        setNoRecipes(true);
      } else {
        setRecipes(response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setNoRecipes(true); // Если рецепты не найдены, выводим сообщение
        } else {
          setError(error.response?.data?.error || error.message);
        }
      } else {
        setError("Невідома помилка");
      }
    }
  }, [ingredientName, selectedTypes, startDate, endDate]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Функция для получения описаний типов рецептов
  useEffect(() => {
    const fetchTypesDescriptions = async () => {
      try {
        if (selectedTypes.length > 0) {
          const response = await axios.get(
            `http://localhost:8080/api/recipe-types`,
            {
              params: { ids: selectedTypes.join(",") },
            }
          );
          setTypesDescriptions(response.data);
        } else {
          setTypesDescriptions([]);
        }
      } catch (error) {
        console.error("Ошибка при получении описаний типов рецептов:", error);
      }
    };

    fetchTypesDescriptions();
  }, [selectedTypes]);

  const getTypesHeader = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id))
      .map((type) => type.type_name)
      .join(", ");
  };

  const getFilteredDescriptions = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id))
      .map((type) => (
        <p key={type.id} className="text-gray-600">
          <strong>{type.type_name}:</strong> {type.description}
        </p>
      ));
  };

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <SearchComponent />
          <div className="ml-4 mt-4 sm:mt-0">
            <RecipeTypeFilter
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="startDate" className="mr-2">
              Начальная дата:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="endDate" className="mr-2">
              Конечная дата:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>

        {dateError && <div className="text-red-500 mb-4">{dateError}</div>}

        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedTypes.length > 0
            ? `Рецепти: ${getTypesHeader()}`
            : "Всі рецепти"}
        </h1>

        {selectedTypes.length > 0 && (
          <div className="mb-4">{getFilteredDescriptions()}</div>
        )}

        {noRecipes ? (
          <div className="text-center text-gray-600 mb-4">
            Створіть свій перший рецепт.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                content={recipe.content}
                typeName={recipe.type_name}
                creationDate={recipe.creation_date}
              />
            ))}
          </div>
        )}

        {error && <div className="text-red-500 mb-4">Помилка: {error}</div>}
      </div>
    </div>
  );
};

export default MainPage;
