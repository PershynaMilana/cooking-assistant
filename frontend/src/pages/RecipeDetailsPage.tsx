import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.tsx";
import Modal from "../components/Modal";

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: string[];
  type_name: string;
  cooking_time: number;
  creation_date: string;
}

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Отримання параметра id з URL
  const [recipe, setRecipe] = useState<Recipe | null>(null); // Стан для рецепта
  const [error, setError] = useState<string | null>(null); // Стан для помилок
  const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модального вікна
  const navigate = useNavigate(); // Хук для навігації

  //? Функція для отримання деталей рецепта
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

  //? Функція для видалення рецепта
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

  // Обробник для відкриття модального вікна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Обробник для закриття модального вікна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обробник для підтвердження видалення
  const handleConfirmDelete = () => {
    deleteRecipe();
    handleCloseModal(); // Закриваємо модальне вікно після видалення
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]); // Додаємо fetchRecipeDetails до залежностей

  //? Функція для форматування часу приготування
  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    // Форматуємо рядок залежно від значення годин та хвилин
    const hourStr = hours > 0 ? `${hours} годин ` : "";
    const minuteStr = `${minutes} хвилин`;
    return hourStr + minuteStr; // Повертаємо рядок без "0 годин"
  };

  // Вивід помилки, якщо вона є
  if (error) {
    return <div className="text-red-500">Помилка: {error}</div>;
  }

  // Вивід завантаження, якщо рецепт ще не завантажений
  if (!recipe) {
    return <div>Завантаження...</div>;
  }

  // Форматування дати створення рецепта
  const formattedDate = new Date(recipe.creation_date).toLocaleDateString(
    "uk-UA"
  );

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        {/* Заголовок рецепта */}
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          {recipe.title}
        </h1>

        {/* Тип рецепта */}
        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          <strong>Тип рецепту:</strong> {recipe.type_name}{" "}
          {/* Відображаємо тип рецепта */}
        </h3>

        {/* Кількість інгредієнтів */}
        <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold ">
          Кількість інгредієнтів - {recipe.ingredients.length} шт.
        </p>

        {/* Опис рецепта */}
        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          <strong>Опис:</strong>{" "}
        </p>
        <p className="text-relative-ps font-montserratRegular">
          {recipe.content}
        </p>

        {/* Інгредієнти */}
        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          Інгредієнти:
        </h3>
        <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
          {recipe.ingredients
            .slice() // Робимо копію масиву, щоб не мутувати оригінал
            .sort((a, b) => a.localeCompare(b)) // Сортуємо інгредієнти
            .map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
        </ul>

        {/* Відображаємо час приготування та дату створення */}
        <p className="text-relative-ps mt-4 font-montserratRegular">
          <strong>Час приготування:</strong>{" "}
          {formatCookingTime(recipe.cooking_time)} {/* Час приготування */}
        </p>
        <p className="text-relative-ps mt-4 font-montserratRegular">
          {" "}
          {/* Збільшений відступ */}
          <strong>Дата створення:</strong> {formattedDate}{" "}
          {/* Дата створення */}
        </p>

        {/* Кнопка видалення рецепта */}
        <button
          onClick={handleOpenModal} // Відкриваємо модальне вікно для підтвердження видалення
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
        >
          Видалити рецепт
        </button>

        {/* Кнопка зміни рецепта */}
        <Link to={`/change-recipe/${recipe.id}`}>
          <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
            Змінити рецепт
          </button>
        </Link>
      </div>

      {/* Модальне вікно для підтвердження видалення */}
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
