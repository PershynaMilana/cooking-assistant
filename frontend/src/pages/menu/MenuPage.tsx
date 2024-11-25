// import React, { useEffect, useState } from "react";
// import RecipeCard from "../../components/RecipeCard";

// interface Menu {
//   id: number;
//   title: string;
//   categoryName: string;
//   categoryDescription: string;
// }

// const MenuPage: React.FC = () => {
//   const [menus, setMenus] = useState<Menu[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/menu");
//         const data = await response.json();
//         setMenus(data);
//       } catch (error) {
//         console.error("Error fetching menus:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenus();
//   }, []);

//   if (loading) {
//     return <p>Завантаження...</p>;
//   }

//   return (
//     <div className="menu-page">
//       <h1 className="text-2xl font-bold mb-4">Меню</h1>
//       <div className="menu-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {menus.map((menu) => (
//           <RecipeCard
//             key={menu.id}
//             id={menu.id}
//             title={menu.title}
//             typeName={menu.categoryName}
//             creationDate={new Date().toISOString()} // Поки немає дати в меню, використовуємо поточну
//             cookingTime={0} // Поки немає часу готування, передаємо 0
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuPage;
// import React, { useEffect, useState, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import MenuCard from "../../components//menu/MenuCard.tsx"; // Компонент для отображения отдельного меню
// import Header from "../../components/Header.tsx";
// import SearchComponent from "../../components/SearchComponent.tsx";
// import MenuCategoryFilter from "../../components/menu/MenuTypeFilter.tsx"; // Фильтр для категорий меню
// import axios from "axios";

// // Интерфейс для описания структуры объекта меню
// interface Menu {
//   id: number;
//   title: string;
//   categoryname: string;
//   menucontent: string; // Поле для отображения описания меню
// }

// // Интерфейс для описания структуры объекта категории меню
// interface MenuCategory {
//   id: number;
//   category_name: string;
// }

// const MenuPage: React.FC = () => {
//   const [menus, setMenus] = useState<Menu[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [categories, setCategories] = useState<MenuCategory[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [noMenus, setNoMenus] = useState<boolean>(false);
//   const [searchParams] = useSearchParams();
//   const ingredientName = searchParams.get("ingredient_name");
//   const token = localStorage.getItem("authToken");

//   // Функция для получения меню с сервера
//   const fetchMenus = useCallback(async () => {
//     setError(null);
//     setNoMenus(false);

//     try {
//       const response = await axios.get(`http://localhost:8080/api/menu`, {
//         params: {
//           ingredient_name: ingredientName || "",
//           category_ids:
//             selectedCategories.length > 0
//               ? selectedCategories.join(",")
//               : undefined,
//         },
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       if (response.data.length === 0) {
//         setNoMenus(true);
//       } else {
//         setMenus(response.data);
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         setError(error.response?.data?.message || error.message);
//       } else {
//         setError("Сталася невідома помилка");
//       }
//     }
//   }, [ingredientName, selectedCategories, token]);

//   // Вызов функции загрузки меню при первом рендере или изменении фильтров
//   useEffect(() => {
//     fetchMenus();
//   }, [fetchMenus]);

//   // Загрузка категорий меню
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/menu-categories`,
//           {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Ошибка при получении категорий меню.", error);
//       }
//     };

//     fetchCategories();
//   }, [token]);

//   return (
//     <div>
//       <Header />
//       <div className="mx-[15vw]">
//         {/* Фильтр категорий и поиск */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
//           <SearchComponent />
//           <div className="ml-4 mt-4 sm:mt-0">
//             <MenuCategoryFilter
//               categories={categories}
//               selectedCategories={selectedCategories}
//               onChange={setSelectedCategories}
//             />
//           </div>
//         </div>

//         {/* Заголовок для списка меню */}
//         <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
//           {selectedCategories.length > 0
//             ? "Меню по категориям"
//             : "Все доступные меню"}
//         </h1>

//         {/* Отображение меню */}
//         {noMenus ? (
//           <div className="text-center text-gray-600 mb-4">
//             Не найдено меню по выбранным фильтрам.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {menus.map((menu) => (
//               <MenuCard
//                 key={menu.id}
//                 id={menu.id}
//                 title={menu.title}
//                 categoryName={menu.categoryname}
//                 content={menu.menucontent} // Отображение контента меню
//               />
//             ))}
//           </div>
//         )}

//         {/* Отображение сообщения об ошибке */}
//         {error && <div className="text-red-500 mb-4">Ошибка: {error}</div>}
//       </div>
//     </div>
//   );
// };

// export default MenuPage;
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MenuCard from "../../components/menu/MenuCard.tsx";
import Header from "../../components/Header.tsx";
import SearchComponent from "../../components/SearchComponent.tsx";
import MenuCategoryFilter from "../../components/menu/MenuCategoryFilter.tsx";
import axios from "axios";

interface Menu {
  id: number;
  title: string;
  categoryname: string;
  menucontent: string;
}

interface MenuCategory {
  id: number;
  category_name: string;
}

const MenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noMenus, setNoMenus] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const ingredientName = searchParams.get("ingredient_name");
  const token = localStorage.getItem("authToken");

  const fetchMenus = useCallback(async () => {
    setError(null);
    setNoMenus(false);

    try {
      const response = await axios.get(`http://localhost:8080/api/menu`, {
        params: {
          ingredient_name: ingredientName || "",
          category_ids:
            selectedCategories.length > 0
              ? selectedCategories.join(",")
              : undefined,
        },
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      {
        console.log(selectedCategories);
      }
      if (response.data.length === 0) {
        setNoMenus(true);
      } else {
        setMenus(response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError("Невідома помилка");
      }
    }
  }, [ingredientName, selectedCategories, token]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/menu-categories`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Помилка при отриманні категорій меню.", error);
      }
    };

    fetchCategories();
  }, [token]);

  return (
    <div>
      <Header />
      <div className="mx-[15vw]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <SearchComponent />
          <div className="ml-4 mt-4 sm:mt-0">
            <MenuCategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>

        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedCategories.length > 0
            ? "Меню по категоріях"
            : "Усі доступні меню"}
        </h1>

        {noMenus ? (
          <div className="text-center text-gray-600 mb-4">
            Меню не знайдено за вибраними фільтрами.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                id={menu.id}
                title={menu.title}
                categoryName={menu.categoryname}
                content={menu.menucontent}
              />
            ))}
          </div>
        )}

        {error && <div className="text-red-500 mb-4">Помилка: {error}</div>}
      </div>
    </div>
  );
};

export default MenuPage;
