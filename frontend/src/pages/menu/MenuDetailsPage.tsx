import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import RecipeCard from "../../components/RecipeCard.tsx";
import Modal from "../../components/Modal.tsx";
import { jwtDecode } from "jwt-decode";

interface Recipe {
  id: number;
  recipe_id: number;
  title: string;
  type_name: string;
  cooking_time: number;
  creation_date: string;
  missingIngredients: [];
}

interface MenuDetails {
  menu: {
    id: number;
    title: string;
    categoryname: string;
    menucontent: string;
  };
  recipes: Recipe[];
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

const MenuDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Функція для отримання деталей меню
  const fetchMenuDetails = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:8080/api/menu/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        throw new Error("Помилка при отриманні деталей меню");
      }
      const data = await response.json();
      setMenu(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  }, [id]);

  // useEffect(() => {
  //   fetchMenuDetails();
  // }, [fetchMenuDetails]);
  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
    fetchMenuDetails();
  }, [fetchMenuDetails]);

  if (error) {
    return <div className="text-red-500">Помилка: {error}</div>;
  }

  if (!menu) {
    return <div>Завантаження...</div>;
  }

  // Обробник для відкриття модального вікна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Обробник для закриття модального вікна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteMenu();
    handleCloseModal();
  };

  const groupedRecipes = menu.recipes.reduce(
    (groups: { [key: string]: Recipe[] }, recipe) => {
      const { type_name } = recipe;
      if (!groups[type_name]) {
        groups[type_name] = [];
      }
      groups[type_name].push(recipe);
      return groups;
    },
    {}
  );

  const deleteMenu = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `http://localhost:8080/api/menu/${menu.menu.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Помилка при видаленні рецепта");
      }
      navigate("/menu");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  };

  const getAllMissingIngredients = () => {
    if (!menu) return [];
    return menu.recipes
      .flatMap((recipe) => recipe.missingIngredients || [])
      .reduce(
        (
          acc: { [key: string]: { quantity: number; unit: string } },
          ingredient
        ) => {
          const { ingredient_name, missing_quantity, unit_name } = ingredient;

          if (!acc[ingredient_name]) {
            acc[ingredient_name] = {
              quantity: missing_quantity,
              unit: unit_name,
            };
          } else {
            acc[ingredient_name].quantity += missing_quantity;
          }
          return acc;
        },
        {}
      );
  };

  const missingIngredients = getAllMissingIngredients();

  const isOwner = menu.menu.personid === currentUserId;

  return (
    <div>
      <Header />
      <div className="mx-[15vw] mb-[5vh]">
        <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
          {menu.menu.title}
        </h1>
        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          <strong>Категорія меню:</strong>{" "}
        </p>
        <p className="text-relative-ps font-montserratRegular">
          {menu.menu.categoryname}
        </p>
        {/* Опис меню */}
        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          <strong>Опис меню:</strong>{" "}
        </p>
        <p className="text-relative-ps font-montserratRegular">
          {menu.menu.menucontent}
        </p>

        <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
          <strong>Рецепти:</strong>{" "}
        </p>
        {/* Відображення карток рецептів */}
        {Object.keys(groupedRecipes).map((type) => (
          <div key={type}>
            <h2 className="text-xs-pxl font-monsterratRegular italic font-normal mt-4 mb-2">
              {type}:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {groupedRecipes[type].map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id} // Использование уникального ID рецепта
                  id={recipe.recipe_id}
                  title={recipe.title}
                  typeName={recipe.type_name}
                  cookingTime={recipe.cooking_time}
                  creationDate={recipe.creation_date}
                />
              ))}
            </div>
          </div>
        ))}

        <strong>Інгредієнти, яких невистачає:</strong>
        <ul>
          {Object.entries(missingIngredients).map(([ingredient, data]) => (
            <li key={ingredient} className="text-relative-ps">
              {ingredient}: {data.quantity} {data.unit}
            </li>
          ))}
        </ul>

        {isOwner && (
          <>
            <Link to={`/change-menu/${menu.menu.id}`}>
              <button className="mt-6 mr-[1vw] bg-yellow-500 text-white py-2 px-4 rounded-full">
                Змінити меню
              </button>
            </Link>
            <button
              onClick={handleOpenModal}
              className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
            >
              Видалити меню
            </button>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Підтвердження видалення"
        message="Ви дійсно хочете видалити це меню?"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MenuDetailsPage;
