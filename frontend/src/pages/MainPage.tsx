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
  type_name: string; // Добавлено поле типа
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
  const [searchParams] = useSearchParams();
  const ingredientName = searchParams.get("ingredient_name");

  // Функция для получения рецептов
  const fetchRecipes = useCallback(async () => {
    try {
      let response;
      if (ingredientName || selectedTypes.length > 0) {
        response = await axios.get(
          `http://localhost:8080/api/recipes-by-ingredient-name`,
          {
            params: {
              ingredient_name: ingredientName || "",
              type_ids: selectedTypes.join(","),
            },
          }
        );
      } else {
        response = await axios.get("http://localhost:8080/api/recipes");
      }

      setRecipes(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  }, [ingredientName, selectedTypes]);

  useEffect(() => {
    fetchRecipes(); // Вызов функции при изменении ингредиента или выбранных типов
  }, [fetchRecipes]);

  // Функция для получения описаний выбранных типов рецептов
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
          setTypesDescriptions(response.data); // Установка описаний типов
        } else {
          setTypesDescriptions([]);
        }
      } catch (error) {
        console.error("Ошибка при получении описаний типов рецептов:", error);
      }
    };

    fetchTypesDescriptions(); // Вызов функции для получения описаний
  }, [selectedTypes]);

  // Заголовок для выбранных типов рецептов
  const getTypesHeader = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id))
      .map((type) => type.type_name)
      .join(", ");
  };

  // Описание для выбранных типов рецептов
  const getFilteredDescriptions = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id))
      .map((type) => (
        <p key={type.id} className="text-gray-600">
          <strong>{type.type_name}:</strong> {type.description}
        </p>
      ));
  };

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <div className="flex justify-between items-center mb-4">
          <SearchComponent />
          <div className="ml-4">
            <RecipeTypeFilter
              selectedTypes={selectedTypes}
              onChange={setSelectedTypes}
            />
          </div>
        </div>

        {/* Заголовок для рецептов */}
        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedTypes.length > 0
            ? `Рецепти: ${getTypesHeader()}`
            : "Всі рецепти"}
        </h1>

        {/* Описание выбранных типов рецептов */}
        {selectedTypes.length > 0 && (
          <div className="mb-4">{getFilteredDescriptions()}</div>
        )}

        {/* Карточки рецептов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              content={recipe.content}
              typeName={recipe.type_name} // Передаем тип рецепта
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
