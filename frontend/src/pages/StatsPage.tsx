import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Header from "../components/Header.tsx";

interface Stat {
  typeName: string;
  count: number;
}

interface Recipe {
  id: number;
  title: string;
  cooking_time: number;
  type_name: string;
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]); // Стан для зберігання статистики
  const [fastestRecipe, setFastestRecipe] = useState<Recipe | null>(null); // Стан для найшвидшого рецепту
  const [slowestRecipe, setSlowestRecipe] = useState<Recipe | null>(null); // Стан для найдовшого рецепту

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Отримання даних про рецепти з сервера
        const response = await axios.get("http://localhost:8080/api/recipes");
        const recipes: Recipe[] = response.data;

        // Рахуємо кількість рецептів кожного типу
        const typeCounts: { [key: string]: number } = {};
        recipes.forEach((recipe) => {
          typeCounts[recipe.type_name] =
            (typeCounts[recipe.type_name] || 0) + 1;
        });

        // Форматуємо статистику для відображення
        const formattedStats = Object.keys(typeCounts).map((typeName) => ({
          typeName,
          count: typeCounts[typeName],
        }));

        setStats(formattedStats);

        // Знаходимо найшвидший і найдовший рецепт
        if (recipes.length > 0) {
          const fastest = recipes.reduce((prev, curr) =>
            prev.cooking_time < curr.cooking_time ? prev : curr
          );
          const slowest = recipes.reduce((prev, curr) =>
            prev.cooking_time > curr.cooking_time ? prev : curr
          );
          setFastestRecipe(fastest);
          setSlowestRecipe(slowest);
        }
      } catch (error) {
        // Обробка помилки при отриманні статистики
        console.error("Помилка отримання статистики:", error);
      }
    };

    fetchStats();
  }, []);

  //TODO: dodelat'
  // useEffect(() => {
  //   const fetchStats2 = async () => {
  //     try {
  //       // Получение данных с бэкенда
  //       const response = await axios.get(
  //         "http://localhost:8080/api/recipes-stats"
  //       );
  //       const { fastestRecipe, slowestRecipe, typeStats } = response.data;
  //       console.log(response);

  //       setFastestRecipe(fastestRecipe);
  //       setSlowestRecipe(slowestRecipe);
  //       setStats(typeStats);
  //     } catch (error) {
  //       console.error("Ошибка при получении статистики:", error);
  //     }
  //   };

  //   fetchStats2();
  // }, []);

  //? Налаштування для графіку
  const chartOptions = {
    chart: {
      type: "pie" as const, // Використовуємо тип "пиріг" для графіка
    },
    labels: stats.map((stat) => stat.typeName), // Мітки для кожного типу рецепту
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200, // Ширина графіка для мобільних пристроїв
          },
          legend: {
            position: "bottom", // Розташування легенди на мобільних пристроях
          },
        },
      },
    ],
  };

  const chartSeries = stats.map((stat) => stat.count); // Дані для відображення на графіку

  return (
    <div>
      <Header />
      <div className="mx-[15vw] my-8">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-relative-h3 font-bold text-center bg-gradient-to-r from-dark-purple to-perfect-purple text-white p-4 rounded-md">
            Статистика Рецептів
          </h1>
        </div>
        <div className="flex justify-between">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Chart
              options={chartOptions} // Параметри графіку
              series={chartSeries} // Дані для графіку
              type="pie"
              width="500"
            />
          </div>
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

            {/* Відображення найшвидшого і найдовшого рецептів */}
            <div className="mt-4">
              <h2 className="text-h3 font-semibold mb-2">
                Швидкий і довгий рецепти
              </h2>
              <p>
                <strong>Найшвидший рецепт:</strong> {fastestRecipe?.title} (
                {fastestRecipe
                  ? `${Math.floor(fastestRecipe.cooking_time / 60)} годин ${
                      fastestRecipe.cooking_time % 60
                    } хвилин`
                  : "N/A"}
                )
              </p>
              <p>
                <strong>Найдовший рецепт:</strong> {slowestRecipe?.title} (
                {slowestRecipe
                  ? `${Math.floor(slowestRecipe.cooking_time / 60)} годин ${
                      slowestRecipe.cooking_time % 60
                    } хвилин`
                  : "N/A"}
                )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
