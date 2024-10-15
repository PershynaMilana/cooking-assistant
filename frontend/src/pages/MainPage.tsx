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
  type_name: string;
  creation_date: string;
  cooking_time: number;
}

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

const MainPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Список рецептів
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]); // Вибрані типи рецептів
  const [typesDescriptions, setTypesDescriptions] = useState<RecipeType[]>([]); // Опис вибраних типів
  const [error, setError] = useState<string | null>(null); // Загальні помилки
  const [dateError, setDateError] = useState<string | null>(null); // Помилки пов'язані з датами
  const [noRecipes, setNoRecipes] = useState<boolean>(false); // Чи є рецепти в результатах пошуку?
  const [searchParams] = useSearchParams(); // Параметри пошуку
  const ingredientName = searchParams.get("ingredient_name"); // Назва інгредієнта з параметрів пошуку

  const [startDate, setStartDate] = useState<string>(""); // Початкова дата для фільтрації
  const [endDate, setEndDate] = useState<string>(""); // Кінцева дата для фільтрації
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Порядок сортування рецептів

  //? Функція для отримання рецептів по фільтрам
  const fetchRecipes = useCallback(async () => {
    setError(null);
    setNoRecipes(false);
    setDateError(null);

    // Перевіряємо правильність вибраного діапазону дат
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError("Початкова дата може бути пізніше кінцевої дати.");
      return;
    }

    const today = new Date(); // Сьогоднішня дата
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
            sort_order: sortOrder,
          },
        }
      );

      // Якщо немає рецептів за вибраними фільтрами
      if (response.data.length === 0) {
        setNoRecipes(true);
      } else {
        setRecipes(response.data); // Зберігаємо рецепти
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setNoRecipes(true);
        } else {
          setError(error.response?.data?.error || error.message);
        }
      } else {
        setError("Невідома помилка");
      }
    }
  }, [ingredientName, selectedTypes, startDate, endDate, sortOrder]);

  //? Функція для отримання описів вибраних типів рецептів
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

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
        console.error("Помилка при отриманні описаних типів рецептів.", error);
      }
    };

    fetchTypesDescriptions();
  }, [selectedTypes]);

  //? Функція для заголовка вибраних типів рецептів
  const getTypesHeader = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id))
      .map((type) => type.type_name)
      .join(", ");
  };

  //? Функція для відображення описів вибраних типів
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

        {/* Фільтрація за датами та сортування */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="startDate" className="mr-2">
              Початкова дата:
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
              Кінцева дата:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
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

        {dateError && <div className="text-red-500 mb-4">{dateError}</div>}

        {/* Заголовок і фільтр рецептів */}
        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedTypes.length > 0
            ? `Рецепти: ${getTypesHeader()}`
            : "Всі рецепти"}
        </h1>

        {selectedTypes.length > 0 && (
          <div className="mb-4">{getFilteredDescriptions()}</div>
        )}

        {/* Відображення результатів фільтрації */}
        {noRecipes ? (
          selectedTypes.length > 0 ? (
            <div className="text-center text-gray-600 mb-4">
              Не було створено таких рецептів.
            </div>
          ) : (
            <div className="text-center text-gray-600 mb-4">
              Створіть свій перший рецепт!
            </div>
          )
        ) : (
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

        {error && <div className="text-red-500 mb-4">Помилка: {error}</div>}
      </div>
    </div>
  );
};

export default MainPage;
