// import React, { useState, useEffect } from "react";
// import axios from "axios";

// interface RecipeType {
//   id: number;
//   type_name: string;
//   description: string;
// }

// interface RecipeTypeFilterProps {
//   selectedTypes: number[];
//   onChange: (selectedTypes: number[]) => void;
// }

// const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
//   selectedTypes,
//   onChange,
// }) => {
//   const [types, setTypes] = useState<RecipeType[]>([]);
//   const [isOpen, setIsOpen] = useState(false);

//   // Получаем список типов рецептов из базы данных
//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/recipe-types"
//         );
//         setTypes(response.data);
//       } catch (error) {
//         console.error("Ошибка при получении типов рецептов:", error);
//       }
//     };

//     fetchTypes();
//   }, []);

//   // Обрабатываем изменение выбора типов
//   const handleCheckboxChange = (id: number) => {
//     let updatedSelectedTypes;
//     if (selectedTypes.includes(id)) {
//       updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id);
//     } else {
//       updatedSelectedTypes = [...selectedTypes, id];
//     }
//     onChange(updatedSelectedTypes);
//   };

//   return (
//     <div className="relative">
//       <button
//         className="bg-purple-600 text-white p-2 rounded-lg"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         Фільтрувати
//       </button>
//       {isOpen && (
//         <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
//           {types.map((type) => (
//             <div key={type.id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={selectedTypes.includes(type.id)}
//                 onChange={() => handleCheckboxChange(type.id)}
//               />
//               <label className="ml-2">{type.type_name}</label>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecipeTypeFilter;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// interface RecipeType {
//   id: number;
//   type_name: string;
//   description: string;
// }

// interface RecipeTypeFilterProps {
//   selectedTypes: number[];
//   onChange: (selectedTypes: number[]) => void;
// }

// const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
//   selectedTypes,
//   onChange,
// }) => {
//   const [types, setTypes] = useState<RecipeType[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const filterRef = useRef<HTMLDivElement>(null); // Создаем ref для компонента

//   // Получаем список типов рецептов из базы данных
//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/recipe-types"
//         );
//         setTypes(response.data);
//       } catch (error) {
//         console.error("Ошибка при получении типов рецептов:", error);
//       }
//     };

//     fetchTypes();
//   }, []);

//   // Обрабатываем изменение выбора типов
//   const handleCheckboxChange = (id: number) => {
//     let updatedSelectedTypes;
//     if (selectedTypes.includes(id)) {
//       updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id);
//     } else {
//       updatedSelectedTypes = [...selectedTypes, id];
//     }
//     onChange(updatedSelectedTypes);
//   };

//   // Закрытие фильтра при клике вне него
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [filterRef]);

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
//           {types.map((type) => (
//             <div key={type.id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={selectedTypes.includes(type.id)}
//                 onChange={() => handleCheckboxChange(type.id)}
//               />
//               <label className="ml-2">{type.type_name}</label>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecipeTypeFilter;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

interface RecipeTypeFilterProps {
  selectedTypes: number[];
  onChange: (selectedTypes: number[]) => void;
}

const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
  selectedTypes,
  onChange,
}) => {
  const [types, setTypes] = useState<RecipeType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null); // Создаем ref для компонента

  // Получаем список типов рецептов из базы данных
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/recipe-types"
        );
        setTypes(response.data);
      } catch (error) {
        console.error("Ошибка при получении типов рецептов:", error);
      }
    };

    fetchTypes();
  }, []);

  // Обрабатываем изменение выбора типов
  const handleCheckboxChange = (id: number) => {
    let updatedSelectedTypes;
    if (selectedTypes.includes(id)) {
      updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id);
    } else {
      updatedSelectedTypes = [...selectedTypes, id];
    }
    onChange(updatedSelectedTypes);
  };

  // Закрытие фильтра при клике вне него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  // Сброс фильтров
  const resetFilters = () => {
    onChange([]); // Сбрасываем выбранные типы
    setIsOpen(false); // Закрываем список
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
          {types.map((type) => (
            <div key={type.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.id)}
                onChange={() => handleCheckboxChange(type.id)}
              />
              <label className="ml-2">{type.type_name}</label>
            </div>
          ))}
          <button
            onClick={resetFilters}
            className="mt-2 text-purple-600 hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeTypeFilter;
