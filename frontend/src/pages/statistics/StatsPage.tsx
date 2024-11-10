import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Header from "../../components/Header.tsx";

// Опис інтерфейсу для статистики типів рецептів
interface Stat {
  typeName: string; // Назва типу рецепту
  count: number; // Кількість рецептів цього типу
}

// Опис інтерфейсу для об'єкта рецепту
interface Recipe {
  id: number; // Унікальний ідентифікатор рецепту
  title: string; // Назва рецепту
  cooking_time: number; // Час приготування в хвилинах
  type_name: string; // Назва типу рецепту
}

const StatsPage: React.FC = () => {
  // Стани для збереження статистики, найшвидших і найдовших рецептів
  const [stats, setStats] = useState<Stat[]>([]);
  const [fastestRecipes, setFastestRecipes] = useState<Recipe[]>([]);
  const [slowestRecipes, setSlowestRecipes] = useState<Recipe[]>([]);

  // Використовуємо useEffect для завантаження даних при першому рендері
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("authToken");
      try {
        // Запит на отримання даних про рецепти
        const response = await axios.get("http://localhost:8080/api/recipes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",  // Добавляем токен в заголовок
          },
        });
        const recipes: Recipe[] = response.data;

        // Підрахунок кількості рецептів за типами
        const typeCounts: { [key: string]: number } = {};
        recipes.forEach((recipe) => {
          typeCounts[recipe.type_name] =
            (typeCounts[recipe.type_name] || 0) + 1;
        });

        // Форматування даних для відображення у вигляді статистики
        const formattedStats = Object.keys(typeCounts).map((typeName) => ({
          typeName,
          count: typeCounts[typeName],
        }));

        setStats(formattedStats);

        // Знаходження найшвидших і найдовших рецептів
        if (recipes.length > 0) {
          const minTime = Math.min(
            ...recipes.map((recipe) => recipe.cooking_time)
          );
          const maxTime = Math.max(
            ...recipes.map((recipe) => recipe.cooking_time)
          );

          const fastest = recipes.filter(
            (recipe) => recipe.cooking_time === minTime
          );
          const slowest = recipes.filter(
            (recipe) => recipe.cooking_time === maxTime
          );

          setFastestRecipes(fastest);
          setSlowestRecipes(slowest);
        }
      } catch (error) {
        // Обробка помилок при запиті даних
        console.error("Помилка отримання статистики:", error);
      }
    };

    // Виклик функції для завантаження даних
    fetchStats();
  }, []);

  // Налаштування для компоненту діаграми
  const chartOptions = {
    chart: {
      type: "pie" as const, // Тип діаграми — кругова
    },
    labels: stats.map((stat) => stat.typeName), // Мітки для кожного сегмента діаграми
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom", // Легенда під діаграмою на маленьких екранах
          },
        },
      },
    ],
  };

  // Серія даних для діаграми (кількість рецептів кожного типу)
  const chartSeries = stats.map((stat) => stat.count);

  return (
    <div>
      {/* Заголовок сторінки */}
      <Header />
      <div className="mx-[15vw] my-8">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-relative-h3 font-bold text-center bg-gradient-to-r from-dark-purple to-perfect-purple text-white p-4 rounded-md">
            Статистика Рецептів
          </h1>
        </div>

        {/* Блок з діаграмою та списком описів */}
        <div className="flex justify-between">
          {/* Діаграма */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="pie"
              width="500"
            />
          </div>

          {/* Список типів рецептів та їх описів */}
          <div className="ml-6 flex flex-col">
            <h2 className="text-h3 font-semibold mb-4">Опис типів рецептів</h2>
            <ul className="space-y-2">
              {stats.map((stat) => (
                <li
                  key={stat.typeName}
                  className="flex justify-between bg-gray-100 p-2 rounded-md"
                >
                  <span className="font-medium">{stat.typeName}</span>
                  <span className="text-gray-600">{stat.count}</span>
                </li>
              ))}
            </ul>

            {/* Блок з інформацією про найшвидші та найдовші рецепти */}
            <div className="mt-4">
              <h2 className="text-h3 font-semibold mb-2">
                Швидкий і довгий рецепти
              </h2>
              <div>
                <strong>Найшвидші рецепти:</strong>
                <ul>
                  {fastestRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      {recipe.title} ({Math.floor(recipe.cooking_time / 60)}{" "}
                      годин {recipe.cooking_time % 60} хвилин)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Найдовші рецепти:</strong>
                <ul>
                  {slowestRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      {recipe.title} ({Math.floor(recipe.cooking_time / 60)}{" "}
                      годин {recipe.cooking_time % 60} хвилин)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
