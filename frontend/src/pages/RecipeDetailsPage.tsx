// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Header from "../components/Header.tsx";

// interface Recipe {
//   id: number;
//   title: string;
//   content: string;
//   ingredients: string[];
//   type_name: string; // Добавляем тип рецепта
// }

// const RecipeDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchRecipeDetails = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/recipe/${id}`);
//       if (!response.ok) {
//         throw new Error("Помилка при отриманні деталей рецепта");
//       }
//       const data = await response.json();
//       setRecipe(data);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   }, [id]);

//   const deleteRecipe = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Помилка при видаленні рецепта");
//       }

//       navigate("/main");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchRecipeDetails();
//   }, [fetchRecipeDetails]);

//   if (error) {
//     return <div>Помилка: {error}</div>;
//   }

//   if (!recipe) {
//     return <div>Завантаження...</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <div className="mx-[15vw]">
//         <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
//           {recipe.title}
//         </h1>

//         {/* Выводим тип рецепта перед описом */}
//         <p className="text-relative-ps my-[2vh] font-montserratMedium font-semibold">
//           Тип рецепта: {recipe.type_name ? recipe.type_name : "Невідомий тип"}
//         </p>

//         <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold">
//           Кількість інгредієнтів - {recipe.ingredients.length} шт.
//         </p>

//         <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
//           Опис:
//         </p>
//         <p className="text-relative-ps font-montserratRegular">
//           {recipe.content}
//         </p>

//         <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
//           Інгредієнти:
//         </h3>
//         <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
//           {recipe.ingredients.map((ingredient, index) => (
//             <li key={index}>{ingredient}</li>
//           ))}
//         </ul>

//         <button
//           onClick={deleteRecipe}
//           className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
//         >
//           Видалити рецепт
//         </button>

//         <Link to={`/change-recipe/${recipe.id}`}>
//           <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
//             Змінити рецепт
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RecipeDetailsPage;

// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Header from "../components/Header.tsx";

// interface Recipe {
//   id: number;
//   title: string;
//   content: string;
//   ingredients: string[];
//   type_name: string;
// }

// const RecipeDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchRecipeDetails = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/recipe/${id}`);
//       if (!response.ok) {
//         throw new Error("Помилка при отриманні деталей рецепта");
//       }
//       const data = await response.json();
//       setRecipe(data);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   }, [id]);

//   const deleteRecipe = async () => {
//     // Шаг 1: Использование window.confirm() для подтверждения удаления
//     const confirmed = window.confirm("Ви дійсно хочете видалити цей рецепт?");

//     if (!confirmed) {
//       return; // Если пользователь нажал "Отмена", выходим из функции
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Помилка при видаленні рецепта");
//       }

//       navigate("/main"); // Перенаправляем на главную страницу после удаления
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchRecipeDetails();
//   }, [fetchRecipeDetails]);

//   if (error) {
//     return <div>Помилка: {error}</div>;
//   }

//   if (!recipe) {
//     return <div>Завантаження...</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <div className="mx-[15vw]">
//         <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
//           {recipe.title}
//         </h1>

//         <p className="text-relative-ps my-[2vh] font-montserratMedium font-semibold">
//           Тип рецепта: {recipe.type_name ? recipe.type_name : "Невідомий тип"}
//         </p>

//         <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold">
//           Кількість інгредієнтів - {recipe.ingredients.length} шт.
//         </p>

//         <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
//           Опис:
//         </p>
//         <p className="text-relative-ps font-montserratRegular">
//           {recipe.content}
//         </p>

//         <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
//           Інгредієнти:
//         </h3>
//         <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
//           {recipe.ingredients.map((ingredient, index) => (
//             <li key={index}>{ingredient}</li>
//           ))}
//         </ul>

//         {/* Кнопка для удаления рецепта */}
//         <button
//           onClick={deleteRecipe} // Вызываем функцию удаления с подтверждением
//           className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
//         >
//           Видалити рецепт
//         </button>

//         <Link to={`/change-recipe/${recipe.id}`}>
//           <button className="bg-yellow-500 text-white py-2 px-4 ml-[1vw] rounded-full">
//             Змінити рецепт
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RecipeDetailsPage;

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.tsx";
import Modal from "../components/Modal"; // Импортируем компонент Modal

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: string[];
  type_name: string; // Добавляем тип рецепта
}

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const navigate = useNavigate();

  // Функция для получения деталей рецепта
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

  // Функция для удаления рецепта
  const deleteRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Помилка при видаленні рецепта");
      }

      // Успешное удаление - перенаправляем на главную страницу
      navigate("/main");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  };

  // Обработчик для открытия модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Обработчик для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик для подтверждения удаления
  const handleConfirmDelete = () => {
    deleteRecipe();
    handleCloseModal(); // Закрываем модальное окно после удаления
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]); // Добавляем fetchRecipeDetails в зависимости

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
        <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
          Тип рецепту: {recipe.type_name} {/* Отображаем тип рецепта */}
        </h3>
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
          onClick={handleOpenModal} // Открываем модальное окно для подтверждения удаления
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
      {/* Модальное окно для подтверждения удаления */}
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
