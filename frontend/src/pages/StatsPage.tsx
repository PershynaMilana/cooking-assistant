import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Header from "../components/Header.tsx";

interface Stat {
  typeName: string;
  count: number;
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recipes");
        const recipes = response.data;

        const typeCounts: { [key: string]: number } = {};
        recipes.forEach((recipe: { type_name: string }) => {
          typeCounts[recipe.type_name] =
            (typeCounts[recipe.type_name] || 0) + 1;
        });

        const formattedStats = Object.keys(typeCounts).map((typeName) => ({
          typeName,
          count: typeCounts[typeName],
        }));

        setStats(formattedStats);
      } catch (error) {
        console.error("Помилка отримання статистики:", error);
      }
    };

    fetchStats();
  }, []);

  const chartOptions = {
    chart: {
      type: "pie" as const,
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

  const chartSeries = stats.map((stat) => stat.count);

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
              options={chartOptions}
              series={chartSeries}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
