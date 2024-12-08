import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Header from "../../components/Header.tsx";
import {
  PDFDownloadLink,
} from "@react-pdf/renderer";
import StatsReportSecond from "./StatsReportSecond.tsx";
import StatsReport from "./StatsReport";

interface Stat {
  typeName: string;
  count: number;
}

interface Recipe {
  id: number;
  title: string;
  cooking_time: number;
  type_name: string;
  ingredients: string[];
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [fastestRecipes, setFastestRecipes] = useState<Recipe[]>([]);
  const [slowestRecipes, setSlowestRecipes] = useState<Recipe[]>([]);
  const [mostIngredientsRecipes, setMostIngredientsRecipes] = useState<
    Recipe[]
  >([]);
  const [leastIngredientsRecipes, setLeastIngredientsRecipes] = useState<
    Recipe[]
  >([]);
  const [reportTime, setReportTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:8080/api/recipes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const recipes: Recipe[] = response.data;

        // Подсчёт количества рецептов по типам
        const typeCounts: { [key: string]: number } = {};
        recipes.forEach((recipe) => {
          typeCounts[recipe.type_name] =
            (typeCounts[recipe.type_name] || 0) + 1;
        });

        const formattedStats = Object.keys(typeCounts).map((typeName) => ({
          typeName,
          count: typeCounts[typeName],
        }));
        setStats(formattedStats);

        // Поиск рецептов по времени приготовления
        if (recipes.length > 0) {
          const minTime = Math.min(
            ...recipes.map((recipe) => recipe.cooking_time)
          );
          const maxTime = Math.max(
            ...recipes.map((recipe) => recipe.cooking_time)
          );

          setFastestRecipes(
            recipes.filter((recipe) => recipe.cooking_time === minTime)
          );
          setSlowestRecipes(
            recipes.filter((recipe) => recipe.cooking_time === maxTime)
          );

          // Поиск рецептов по количеству ингредиентов
          const maxIngredients = Math.max(
            ...recipes.map((recipe) => recipe.ingredients.length)
          );
          const minIngredients = Math.min(
            ...recipes.map((recipe) => recipe.ingredients.length)
          );

          setMostIngredientsRecipes(
            recipes.filter(
              (recipe) => recipe.ingredients.length === maxIngredients
            )
          );
          setLeastIngredientsRecipes(
            recipes.filter(
              (recipe) => recipe.ingredients.length === minIngredients
            )
          );
        }
      } catch (error) {
        console.error("Ошибка получения статистики:", error);
      }
    };

    fetchStats();
  }, []);


  // Опции для диаграммы
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: stats.map((stat) => stat.typeName),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  // Данные для диаграммы
  const chartSeries = stats.map((stat) => stat.count);

  const handleGenerateReport = () => {
    setReportTime(new Date());
  };

  return (
    <div>
      <Header />
      <div className="mx-[15vw] my-8">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-relative-h3 font-bold text-center bg-gradient-to-r from-dark-purple to-perfect-purple text-white p-4 rounded-md">
            Статистика рецептів
          </h1>
        </div>

        <div className="flex justify-between">
          {/* Диаграмма */}
          <div className="bg-white p-6 h-full rounded-xl shadow-lg border border-gray-200">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie"
                width="500"
                height="auto"
            />
            <div className="flex my-5 flex-col space-y-4">
              <PDFDownloadLink
                  document={<StatsReport reportTime={reportTime || new Date()} stats={stats}/>}
                  fileName="Statistics_Report.pdf"
                  onClick={handleGenerateReport}
                  className="bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
              >
                Звіт статистики PDF

              </PDFDownloadLink>

              <PDFDownloadLink
                  document={<StatsReportSecond reportTime={reportTime || new Date()}/>}
                  fileName="Statistics_Second_Report.pdf"
                  onClick={handleGenerateReport}
                  className="bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
              >
                Звіт статистики PDF варіант 2

              </PDFDownloadLink>
            </div>
          </div>


          {/* Список типов рецептов и информация */}
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

            <div className="mt-4">
              <h2 className="text-h3 font-semibold mb-2">Деталі рецептів</h2>
              <div>
                <strong>Найшвидші рецепти:</strong>
                <ul>
                  {fastestRecipes.map((recipe) => (
                      <li key={recipe.id}>
                        {recipe.title} ({recipe.cooking_time} хв.)
                      </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Найдовші рецепти:</strong>
                <ul>
                  {slowestRecipes.map((recipe) => (
                      <li key={recipe.id}>
                        {recipe.title} ({recipe.cooking_time} хв.)
                      </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Рецепти з найбільшою кількістю інгредієнтів:</strong>
                <ul>
                  {mostIngredientsRecipes.map((recipe) => (
                      <li key={recipe.id}>
                        {recipe.title} ({recipe.ingredients.length} інг.)
                      </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Рецепти з найменшою кількістю інгредієнтів:</strong>
                <ul>
                  {leastIngredientsRecipes.map((recipe) => (
                      <li key={recipe.id}>
                        {recipe.title} ({recipe.ingredients.length} інг.)
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
