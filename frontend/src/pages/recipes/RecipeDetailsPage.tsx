import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Modal from "../../components/Modal.tsx";
import { jwtDecode } from "jwt-decode";

interface Ingredient {
  name: string;
  quantity_recipe_ingredients: number;
  unit_name: string;
}

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: Ingredient[];
  type_name: string;
  cooking_time: number;
  creation_date: string;
  servings: string;
  person_id: number;
}
const getCurrentUserId = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded: { id: number } = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
};

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchRecipeDetails = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
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

  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);
  const isOwner = recipe?.person_id === currentUserId;

  const deleteRecipe = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Помилка при видаленні рецепта");
      }

      navigate("/main");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteRecipe();
    handleCloseModal();
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const hourStr = hours > 0 ? `${hours} годин ` : "";
    const minuteStr = `${minutes} хвилин`;
    return hourStr + minuteStr;
  };

  if (error) {
    return <div className="text-red-500">Помилка: {error}</div>;
  }

  if (!recipe) {
    return <div>Завантаження...</div>;
  }

  const formattedDate = new Date(recipe.creation_date).toLocaleDateString(
    "uk-UA"
  );

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          {recipe.title}
        </h1>

        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          <strong>Тип рецепту:</strong> {recipe.type_name}
        </h3>

        <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold ">
          Кількість інгредієнтів - {recipe.ingredients.length} шт.
        </p>

        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          <strong>Опис:</strong>
        </p>
        <p className="text-relative-ps font-montserratRegular">
          {recipe.content}
        </p>

        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          Інгредієнти:
        </h3>
        <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
          {recipe.ingredients
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.quantity_recipe_ingredients}{" "}
                {ingredient.unit_name}
              </li>
            ))}
        </ul>

        <p className="text-relative-ps mt-4 font-montserratRegular">
          <strong>Час приготування:</strong>{" "}
          {formatCookingTime(recipe.cooking_time)}
        </p>
        <p className="text-relative-ps mt-4 font-montserratRegular">
          <strong>Дата створення:</strong> {formattedDate}
        </p>

        <p className="text-relative-ps mt-4 font-montserratRegular">
          <strong>Кількість порцій (на яку тару розраховано рецепт) :</strong>{" "}
          {recipe.servings}
        </p>

        {/* <button
          onClick={handleOpenModal}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
        >
          Видалити рецепт
        </button>

        <Link to={`/change-recipe/${recipe.id}`}>
          <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
            Змінити рецепт
          </button>
        </Link> */}
        {isOwner && (
          <>
            <button
              onClick={handleOpenModal}
              className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
            >
              Видалити рецепт
            </button>
            <Link to={`/change-recipe/${recipe.id}`}>
              <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
                Змінити рецепт
              </button>
            </Link>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Підтвердження видалення"
        message="Ви дійсно хочете видалити цей рецепт?"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RecipeDetailsPage;
