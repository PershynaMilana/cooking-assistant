import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MenuCard from "../../components/menu/MenuCard.tsx";
import Header from "../../components/Header.tsx";
import SearchComponent from "../../components/SearchComponent.tsx";
import MenuCategoryFilter from "../../components/menu/MenuCategoryFilter.tsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

interface Menu {
  id: number;
  title: string;
  categoryname: string;
  menucontent: string;
}

interface MenuCategory {
  menu_category_id: number;
  category_name: string;
}

const UserMenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noMenus, setNoMenus] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const menuName = searchParams.get("ingredient_name");
  const token = localStorage.getItem("authToken");

  const fetchMenus = useCallback(async () => {
    setError(null);
    setNoMenus(false);

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const encodedMenuName = encodeURIComponent(menuName || "");

      const response = await axios.get(
        `http://localhost:8080/api/menu-filters-person/${userId}`,
        {
          params: {
            menu_name: encodedMenuName,
            category_ids:
              selectedCategories.length > 0
                ? selectedCategories.join(",")
                : undefined,
          },
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // Обрабатываем полученные данные
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
  }, [menuName, selectedCategories, token]);

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
          <SearchComponent placeholder={"назвою меню"} />
          <div className="ml-4 mt-4 sm:mt-0">
            <MenuCategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>
        <Link
          to="/add-menu"
          className="flex items-center justify-center font-montserratRegular-normal text-almost-white bg-purple-700 p-4 w-15 m-7 rounded-3xl"
        >
          Додати меню
        </Link>

        <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
          {selectedCategories.length > 0
            ? `Меню за категоріями: ${categories
                .filter((category) =>
                  selectedCategories.includes(category.menu_category_id)
                )
                .map((category) => category.category_name)
                .join(", ")}`
            : "Всі меню"}
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

export default UserMenuPage;
