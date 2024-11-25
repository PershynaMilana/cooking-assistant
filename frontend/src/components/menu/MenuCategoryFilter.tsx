// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// interface RecipeType {
//   id: number;
//   type_name: string;
//   description: string;
// }

// interface RecipeTypeFilterProps {
//   selectedTypes: number[]; // Масив ідентифікаторів вибраних типів рецептів
//   onChange: (selectedTypes: number[]) => void; // Функція для обробки змін вибору типів
// }

// const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
//   selectedTypes,
//   onChange,
// }) => {
//   const [types, setTypes] = useState<RecipeType[]>([]); // Стан для зберігання типів рецептів
//   const [isOpen, setIsOpen] = useState(false); // Стан для відкриття/закриття списку фільтрів
//   const filterRef = useRef<HTMLDivElement>(null); // Створюємо ref для компонента

//   //? Отримуємо список типів рецептів із бази даних
//   useEffect(() => {
//     const fetchTypes = async () => {
//       const token = localStorage.getItem("authToken");  // Получаем токен из localStorage

//       try {
//         const response = await axios.get(
//             "http://localhost:8080/api/recipe-types",
//             {
//               headers: {
//                 Authorization: token ? `Bearer ${token}` : "", // Добавляем токен в заголовок
//               },
//             }
//         );
//         setTypes(response.data); // Обновляем состояние с типами рецептов
//       } catch (error) {
//         // Обработка ошибки при получении данных
//         console.error("Ошибка при получении типов рецептов:", error);
//       }
//     };

//     fetchTypes();
//   }, []);

//   //? Обробляємо зміну вибору типів
//   const handleCheckboxChange = (id: number) => {
//     let updatedSelectedTypes;
//     if (selectedTypes.includes(id)) {
//       updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id); // Видаляємо вибраний тип
//     } else {
//       updatedSelectedTypes = [...selectedTypes, id]; // Додаємо вибраний тип
//     }
//     onChange(updatedSelectedTypes); // Передаємо оновлений список вибраних типів
//   };

//   //? Закриття фільтра при кліку поза ним
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         filterRef.current &&
//         !filterRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false); // Закриваємо фільтр, якщо клік був поза його межами
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [filterRef]);

//   //? Скидання фільтрів
//   const resetFilters = () => {
//     onChange([]); // Скидаємо вибрані типи
//     setIsOpen(false); // Закриваємо список
//   };

//   return (
//     <div ref={filterRef} className="relative">
//       <button
//         className="bg-purple-600 text-white p-2 rounded-lg"
//         onClick={() => setIsOpen(!isOpen)} // Перемикаємо стан відкриття/закриття фільтра
//       >
//         Фільтрувати
//       </button>
//       {isOpen && (
//         <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
//           {types.map((type) => (
//             <div key={type.id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={selectedTypes.includes(type.id)} // Відмічаємо обрані типи
//                 onChange={() => handleCheckboxChange(type.id)} // Обробляємо зміну вибору
//               />
//               <label className="ml-2">{type.type_name}</label>
//             </div>
//           ))}
//           <button
//             onClick={resetFilters}
//             className="mt-2 text-purple-600 hover:underline"
//           >
//             Скинути фільтри
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecipeTypeFilter;
// import React, { useState, useEffect, useRef } from "react";

// interface MenuCategory {
//   id: number;
//   category_name: string;
// }

// interface MenuCategoryFilterProps {
//   categories: MenuCategory[];
//   selectedCategories: number[];
//   onChange: (selectedCategories: number[]) => void;
// }

// const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
//   categories,
//   selectedCategories,
//   onChange,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const filterRef = useRef<HTMLDivElement>(null);

//   const handleCheckboxChange = (id: number) => {
//     const updatedSelectedCategories = selectedCategories.includes(id)
//       ? selectedCategories.filter((categoryId) => categoryId !== id)
//       : [...selectedCategories, id];
//     onChange(updatedSelectedCategories);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         filterRef.current &&
//         !filterRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const resetFilters = () => {
//     onChange([]);
//     setIsOpen(false);
//   };

//   return (
//     <div ref={filterRef} className="relative">
//       <button
//         className="bg-purple-600 text-white p-2 rounded-lg"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         Фільтрувати
//       </button>
//       {isOpen && (
//         <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
//           {categories.map((category) => (
//             <div key={category.id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={selectedCategories.includes(category.id)}
//                 onChange={() => handleCheckboxChange(category.id)}
//               />
//               <label className="ml-2">{category.category_name}</label>
//             </div>
//           ))}
//           <button
//             onClick={resetFilters}
//             className="mt-2 text-purple-600 hover:underline"
//           >
//             Скинути фільтри
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuCategoryFilter;
// import React, { useState, useEffect, useRef } from "react";

// interface MenuCategory {
//   menu_category_id: number;
//   category_name: string;
// }

// interface MenuCategoryFilterProps {
//   categories: MenuCategory[];
//   selectedCategories: number[];
//   onChange: (selectedCategories: number[]) => void;
// }

// const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
//   categories,
//   selectedCategories,
//   onChange,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const filterRef = useRef<HTMLDivElement>(null);

//   const handleCheckboxChange = (id: number) => {
//     const updatedSelectedCategories = selectedCategories.includes(id)
//       ? selectedCategories.filter((categoryId) => categoryId !== id)
//       : [...selectedCategories, id];
//     onChange(updatedSelectedCategories);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         filterRef.current &&
//         !filterRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const resetFilters = () => {
//     onChange([]);
//     setIsOpen(false);
//   };
//   {
//     // console.log(categories);
//   }
//   return (
//     <div ref={filterRef} className="relative">
//       <button
//         className="bg-purple-600 text-white p-2 rounded-lg"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         Фільтрувати
//       </button>
//       {isOpen && (
//         <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
//           {categories.map((category) => (
//             <div key={category.menu_category_id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={selectedCategories.includes(category.menu_category_id)}
//                 onChange={() => handleCheckboxChange(category.menu_category_id)}
//               />
//               <label className="ml-2">{category.category_name}</label>
//             </div>
//           ))}
//           <button
//             onClick={resetFilters}
//             className="mt-2 text-purple-600 hover:underline"
//           >
//             Скинути фільтри
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuCategoryFilter;
import React, { useState, useEffect, useRef } from "react";

interface MenuCategory {
  menu_category_id: number;
  category_name: string;
}

interface MenuCategoryFilterProps {
  categories: MenuCategory[];
  selectedCategories: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>; // Добавлено для корректной типизации
}

const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (id: number) => {
    let updatedSelectedCategories;
    if (selectedCategories.includes(id)) {
      // Видаляємо вибраний тип, якщо він вже є у списку
      updatedSelectedCategories = selectedCategories.filter(
        (categoryId) => categoryId !== id
      );
    } else {
      // Додаємо вибраний тип, якщо його немає у списку
      updatedSelectedCategories = [...selectedCategories, id];
    }
    onChange(updatedSelectedCategories);
    console.log(updatedSelectedCategories, categories, selectedCategories); // Передаємо оновлений список вибраних типів
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetFilters = () => {
    onChange([]);
    setIsOpen(false);
  };

  return (
    <div ref={filterRef} className="relative">
      <button
        className="bg-purple-600 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        Фільтрувати
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
          {categories.map((category) => (
            <div key={category.menu_category_id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.menu_category_id)}
                onChange={() => handleCheckboxChange(category.menu_category_id)}
              />
              <label className="ml-2">{category.category_name}</label>
            </div>
          ))}
          <button
            onClick={resetFilters}
            className="mt-2 text-purple-600 hover:underline"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuCategoryFilter;
