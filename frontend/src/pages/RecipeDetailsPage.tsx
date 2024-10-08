import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.tsx";

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: string[];
}

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Функція для отримання деталей рецепта
  const fetchRecipeDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${id}`);
      if (!response.ok) {
        throw new Error("Помилка при отриманні деталей рецепта");
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  }, [id]);

  // Функція для видалення рецепта
  const deleteRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Помилка при видаленні рецепта");
      }

      // Успішне видалення - перенаправляємо на головну сторінку
      navigate("/main");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]); // Додаємо fetchRecipeDetails до залежностей

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!recipe) {
    return <div>Завантаження...</div>;
  }

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          {recipe.title}
        </h1>
        <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold ">
          Кількість інгредієнтів - {recipe.ingredients.length} шт.
        </p>
        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          Опис:{" "}
        </p>
        <p className="text-relative-ps font-montserratRegular">
          {recipe.content}
        </p>
        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          Інгредієнти:
        </h3>
        <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <button
          onClick={deleteRecipe}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
        >
          Видалити рецепт
        </button>
        <Link to={`/change-recipe/${recipe.id}`}>
          <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
            Змінити рецепт
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
