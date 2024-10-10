// import React, { useEffect, useState, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import RecipeCard from "../components/RecipeCard";
// import Header from "../components/Header.tsx";
// import SearchComponent from "../components/SearchComponent.tsx";
// import axios from "axios";

// interface Recipe {
//   id: number;
//   title: string;
//   content: string;
//   ingredients: string[];
// }

// const MainPage: React.FC = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [searchParams] = useSearchParams();
//   const ingredientName = searchParams.get("ingredient_name"); // Отримуємо параметр з URL

//   // Функція для отримання рецептів
//   const fetchRecipes = useCallback(async () => {
//     try {
//       let response;
//       if (ingredientName) {
//         // Якщо є параметр пошуку, робимо запит з ним
//         response = await axios.get(
//           `http://localhost:8080/api/recipes-by-ingredient-name`,
//           {
//             params: { ingredient_name: ingredientName },
//           }
//         );
//       } else {
//         // Інакше робимо звичайний запит
//         response = await axios.get("http://localhost:8080/api/recipes");
//       }

//       setRecipes(response.data);
//     } catch (error: unknown) {
//       // Виправляємо тип для помилок
//       if (axios.isAxiosError(error)) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   }, [ingredientName]); // Додаємо ingredientName як залежність

//   useEffect(() => {
//     fetchRecipes(); // Викликаємо функцію для отримання рецептів
//   }, [fetchRecipes]); // Виправляємо залежність для useEffect

//   if (error) {
//     return <div>Помилка: {error}</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <div className="mx-[15vw]">
//         <SearchComponent />
//         <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
//           Всі рецепти
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {recipes.map((recipe) => (
//             <RecipeCard
//               key={recipe.id}
//               id={recipe.id}
//               title={recipe.title}
//               content={recipe.content}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

// import React, { useEffect, useState, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import RecipeCard from "../components/RecipeCard";
// import Header from "../components/Header.tsx";
// import SearchComponent from "../components/SearchComponent.tsx";
// import RecipeTypeFilter from "../components/RecipeTypeFilter"; // Добавляем фильтр типов
// import axios from "axios";

// interface Recipe {
//   id: number;
//   title: string;
//   content: string;
//   ingredients: string[];
// }

// interface RecipeType {
//   id: number;
//   type_name: string;
//   description: string;
// }

// const MainPage: React.FC = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
//   const [typesDescriptions, setTypesDescriptions] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [searchParams] = useSearchParams();
//   const ingredientName = searchParams.get("ingredient_name");

//   const fetchRecipes = useCallback(async () => {
//     try {
//       let response;
//       if (ingredientName || selectedTypes.length > 0) {
//         response = await axios.get(
//           `http://localhost:8080/api/recipes-by-ingredient-name`,
//           {
//             params: {
//               ingredient_name: ingredientName || "",
//               type_ids: selectedTypes.join(","),
//             },
//           }
//         );
//       } else {
//         response = await axios.get("http://localhost:8080/api/recipes");
//       }

//       setRecipes(response.data);
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         setError(error.message);
//       } else {
//         setError("Невідома помилка");
//       }
//     }
//   }, [ingredientName, selectedTypes]);

//   useEffect(() => {
//     fetchRecipes();
//   }, [fetchRecipes]);

//   // Функция для обновления описаний типов рецептов
//   useEffect(() => {
//     const fetchTypesDescriptions = async () => {
//       try {
//         if (selectedTypes.length > 0) {
//           const response = await axios.get(
//             `http://localhost:8080/api/recipe-types`,
//             { params: { ids: selectedTypes.join(",") } }
//           );
//           const descriptions = response.data.map(
//             (type: RecipeType) => `${type.type_name}: ${type.description}`
//           );
//           setTypesDescriptions(descriptions);
//         } else {
//           setTypesDescriptions([]);
//         }
//       } catch (error) {
//         console.error("Ошибка при получении описаний типов рецептов:", error);
//       }
//     };

//     fetchTypesDescriptions();
//   }, [selectedTypes]);

//   if (error) {
//     return <div>Помилка: {error}</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <div className="mx-[15vw]">
//         <SearchComponent />
//         <RecipeTypeFilter
//           selectedTypes={selectedTypes}
//           onChange={setSelectedTypes}
//         />
//         <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
//           {selectedTypes.length > 0
//             ? `Рецепти: ${typesDescriptions.join(", ")}`
//             : "Всі рецепти"}
//         </h1>
//         {typesDescriptions.length > 0 && (
//           <div className="mb-4">
//             {typesDescriptions.map((desc, index) => (
//               <p key={index} className="text-gray-600">
//                 {desc}
//               </p>
//             ))}
//           </div>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {recipes.map((recipe) => (
//             <RecipeCard
//               key={recipe.id}
//               id={recipe.id}
//               title={recipe.title}
//               content={recipe.content}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Header from "../components/Header.tsx";
import SearchComponent from "../components/SearchComponent.tsx";
import RecipeTypeFilter from "../components/RecipeTypeFilter"; // Фильтр по типам
import axios from "axios";

interface Recipe {
  id: number;
  title: string;
  content: string;
  ingredients: string[];
}

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

const MainPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]); // Выбранные типы рецептов
  const [typesDescriptions, setTypesDescriptions] = useState<RecipeType[]>([]); // Описания типов
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const ingredientName = searchParams.get("ingredient_name"); // Поиск по ингредиенту

  // Функция для получения рецептов
  const fetchRecipes = useCallback(async () => {
    try {
      let response;

      if (ingredientName) {
        // Если выбран ингредиент
        if (selectedTypes.length > 0) {
          // Если выбраны типы, отправляем их на сервер
          response = await axios.get(
            `http://localhost:8080/api/recipes-by-ingredient-name`,
            {
              params: {
                ingredient_name: ingredientName,
                type_ids: selectedTypes.join(","), // Отправляем типы рецептов
              },
            }
          );
        } else {
          // Если типы не выбраны, ищем по ингредиенту среди всех типов рецептов
          response = await axios.get(
            `http://localhost:8080/api/recipes-by-ingredient-name`,
            {
              params: {
                ingredient_name: ingredientName,
              },
            }
          );
        }
      } else if (selectedTypes.length > 0) {
        // Если ингредиент не выбран, но выбраны типы
        response = await axios.get(
          `http://localhost:8080/api/recipes`,
          {
            params: {
              type_ids: selectedTypes.join(","), // Запрашиваем по типам
            },
          }
        );
      } else {
        // Если ни типы, ни ингредиенты не выбраны — запрос всех рецептов
        response = await axios.get("http://localhost:8080/api/recipes");
      }

      setRecipes(response.data); // Установка полученных рецептов
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.message); // Установка ошибки, если что-то пошло не так
      } else {
        setError("Невідома помилка"); // Неизвестная ошибка
      }
    }
  }, [ingredientName, selectedTypes]);

  useEffect(() => {
    fetchRecipes(); // Вызов функции при изменении ингредиента или типов
  }, [fetchRecipes]);

  // Функция для получения описаний выбранных типов рецептов
  useEffect(() => {
    const fetchTypesDescriptions = async () => {
      try {
        if (selectedTypes.length > 0) {
          const response = await axios.get(
            `http://localhost:8080/api/recipe-types`,
            { params: { ids: selectedTypes.join(",") } }
          );
          setTypesDescriptions(response.data); // Установка описаний типов
        } else {
          setTypesDescriptions([]); // Очищаем описания, если типы не выбраны
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
      .filter((type) => selectedTypes.includes(type.id)) // Фильтруем только выбранные типы
      .map((type) => type.type_name)
      .join(", ");
  };

  // Описание для выбранных типов рецептов
  const getFilteredDescriptions = () => {
    return typesDescriptions
      .filter((type) => selectedTypes.includes(type.id)) // Фильтруем только выбранные типы
      .map((type) => (
        <p key={type.id} className="text-gray-600">
          <strong>{type.type_name}:</strong> {type.description}
        </p>
      ));
  };

  if (error) {
    return <div>Помилка: {error}</div>; // Вывод ошибки, если есть
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
            ? `Рецепти: ${getTypesHeader()}` // Вывод заголовка для выбранных типов
            : "Всі рецепти"} {/* Заголовок для всех рецептов */}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
