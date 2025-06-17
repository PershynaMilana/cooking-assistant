import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard.tsx";
import Header from "../../components/Header.tsx";
import SearchComponent from "../../components/SearchComponent.tsx";
import RecipeTypeFilter from "../../components/RecipeTypeFilter.tsx";
import DateFilterDropdown from "../../components/DateFilterDropdown.tsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

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
            type_ids:
              selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
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
        setError("Unknown error");
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
        console.error("Error fetching recipe type descriptions.", error);
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
        {/* Filter and Search Block */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <SearchComponent placeholder={"ingredient"} />
          <div className="ml-4 mt-4 sm:mt-0">
            <RecipeTypeFilter
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
            />
          </div>
        </div>

        {/* Date and Cooking Time Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <DateFilterDropdown
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          {/* Min and Max Cooking Time */}
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="minCookingTime" className="mr-2">
              Min cooking time:
            </label>
            <input
              type="number"
              id="minCookingTime"
              value={minCookingTime}
              onChange={(e) => setMinCookingTime(e.target.value)}
              placeholder="min"
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
              Max cooking time:
            </label>
            <input
              type="number"
              id="maxCookingTime"
              value={maxCookingTime}
              onChange={(e) => setMaxCookingTime(e.target.value)}
              placeholder="min"
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

          {/* Sort Order */}
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="sortOrder" className="mr-2">
              Sort by time:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded p-2"
            >
              <option value="asc">From fast to slow</option>
              <option value="desc">From slow to fast</option>
            </select>
          </div>
        </div>

        {/* Add Recipe Button */}
        <Link
          to="/add-recipe"
          className="flex items-center justify-center font-montserratRegular-normal text-almost-white bg-purple-700 p-4 w-15 m-7 rounded-3xl"
        >
          Add Recipe
        </Link>

        {/* Recipes Header */}
        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedTypes.length > 0
            ? `Recipes: ${getTypesHeader()}`
            : "My Recipes"}
        </h1>

        {/* Filtered Descriptions */}
        {selectedTypes.length > 0 && (
          <div className="mb-4">{getFilteredDescriptions()}</div>
        )}

        {/* No recipes message */}
        {noRecipes ? (
          <div className="text-center text-gray-600 mb-4">
            {selectedTypes.length > 0
              ? "No recipes of this type found."
              : "Create your first recipe!"}
          </div>
        ) : (
          // Recipes list
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

        {/* Error message */}
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      </div>
    </div>
  );
};

export default UserRecipesPage;
