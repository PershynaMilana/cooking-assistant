import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard.tsx";
import Header from "../../components/Header.tsx";
import SearchComponent from "../../components/SearchComponent.tsx";
import RecipeTypeFilter from "../../components/RecipeTypeFilter.tsx";
import DateFilterDropdown from "../../components/DateFilterDropdown.tsx";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

// Інтерфейс для опису структури об'єкта рецепта
interface Recipe {
  id: number;
  title: string;
  type_name: string;
  creation_date: string;
  cooking_time: number;
}

// Інтерфейс для опису структури об'єкта типу рецепта
interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

const UserRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [typesDescriptions, setTypesDescriptions] = useState<RecipeType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noRecipes, setNoRecipes] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const ingredientName = searchParams.get("ingredient_name");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [minCookingTime, setMinCookingTime] = useState<string>("");
  const [maxCookingTime, setMaxCookingTime] = useState<string>("");

  const sortRecipes = useCallback(
      (recipes: Recipe[]): Recipe[] => {
        return recipes.sort((a, b) => {
          if (sortOrder === "asc") {
            return (
                a.cooking_time - b.cooking_time || a.title.localeCompare(b.title)
            );
          } else {
            return (
                b.cooking_time - a.cooking_time || a.title.localeCompare(b.title)
            );
          }
        });
      },
      [sortOrder]
  );

  const fetchRecipes = useCallback(async () => {
    setError(null);
    setNoRecipes(false);

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await axios.get(
          `http://localhost:8080/api/recipes-filters-person/${userId}`,
          {
            params: {
              ingredient_name: ingredientName || "",
              type_ids: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
              start_date: startDate || undefined,
              end_date: endDate || undefined,
              min_cooking_time: minCookingTime || undefined,
              max_cooking_time: maxCookingTime || undefined,
              sort_order: sortOrder,
            },
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
      );

      if (response.data.length === 0) {
        setNoRecipes(true);
      } else {
        const sortedRecipes = sortRecipes(response.data);
        setRecipes(sortedRecipes);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  }, [
    ingredientName,
    selectedTypes,
    startDate,
    endDate,
    minCookingTime,
    maxCookingTime,
    sortOrder,
    sortRecipes,
  ]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    const fetchTypesDescriptions = async () => {
      const token = localStorage.getItem("authToken");

      try {
        if (selectedTypes.length > 0) {
          const response = await axios.get(
              `http://localhost:8080/api/recipe-types`,
              {
                params: { ids: selectedTypes.join(",") },
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
          );
          setTypesDescriptions(response.data);
        } else {
          setTypesDescriptions([]);
        }
      } catch (error) {
        console.error("Ошибка при получении описаний типов рецептов.", error);
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
        {/* Блок для компонентів фільтрації та пошуку */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <SearchComponent placeholder={"інградієнтом"}/>
          <div className="ml-4 mt-4 sm:mt-0">
            <RecipeTypeFilter
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
            />
          </div>
        </div>

        {/* Блок для фільтрації за датою та часом приготування */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <DateFilterDropdown
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          {/* Поля для введення мінімального та максимального часу приготування */}
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="minCookingTime" className="mr-2">
              Мін. час готовки:
            </label>
            <input
              type="number"
              id="minCookingTime"
              value={minCookingTime}
              onChange={(e) => setMinCookingTime(e.target.value)}
              placeholder="хвилини"
              className="border rounded p-2 w-20"
              min="0"
              onKeyDown={(e) => {
                if (e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>

          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="maxCookingTime" className="mr-2">
              Макс. час готовки:
            </label>
            <input
              type="number"
              id="maxCookingTime"
              value={maxCookingTime}
              onChange={(e) => setMaxCookingTime(e.target.value)}
              placeholder="хвилини"
              className="border rounded p-2 w-20"
              min="1"
              onKeyDown={(e) => {
                if (e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>

          {/* Вибір порядку сортування рецептів */}
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="sortOrder" className="mr-2">
              Сортувати за часом:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded p-2"
            >
              <option value="asc">Від швидких до довгих</option>
              <option value="desc">Від довгих до швидких</option>
            </select>
          </div>
        </div>

        {/* Заголовок для списку рецептів */}
        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedTypes.length > 0
            ? `Рецепти: ${getTypesHeader()}`
            : "Мої рецепти"}
        </h1>

        {/* Відображення описів типів, якщо вибрані */}
        {selectedTypes.length > 0 && (
          <div className="mb-4">{getFilteredDescriptions()}</div>
        )}

        {/* Відображення повідомлення, якщо рецептів немає */}
        {noRecipes ? (
          <div className="text-center text-gray-600 mb-4">
            {selectedTypes.length > 0
              ? "Не було створено таких рецептів."
              : "Створіть свій перший рецепт!"}
          </div>
        ) : (
          // Відображення списку рецептів
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                typeName={recipe.type_name}
                creationDate={recipe.creation_date}
                cookingTime={recipe.cooking_time}
              />
            ))}
          </div>
        )}

        {/* Відображення повідомлення про помилку */}
        {error && <div className="text-red-500 mb-4">Помилка: {error}</div>}
      </div>
    </div>
  );
};

export default UserRecipesPage;
