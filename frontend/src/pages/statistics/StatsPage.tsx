import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import type { RecipeWithIngredientNames } from "types/recipe";

import { getRecipes } from "api/recipesApi";

import { Header } from "components/layout/Header";

import StatsReport from "./StatsReport";
import StatsReportSecond from "./StatsReportSecond.tsx";

interface Stat {
    typeName: string;
    count: number;
}

const StatsPage: React.FC = () => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [fastestRecipes, setFastestRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [slowestRecipes, setSlowestRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [mostIngredientsRecipes, setMostIngredientsRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [leastIngredientsRecipes, setLeastIngredientsRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [reportTime, setReportTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const recipes = await getRecipes();

                // count recipes per type
                const typeCounts: Record<string, number> = {};

                recipes.forEach((recipe) => {
                    typeCounts[recipe.type_name] =
                        (typeCounts[recipe.type_name] || 0) + 1;
                });

                const formattedStats = Object.keys(typeCounts).map(
                    (typeName) => ({
                        typeName,
                        count: typeCounts[typeName],
                    }),
                );

                setStats(formattedStats);

                // find recipes by cooking time
                if (recipes.length > 0) {
                    const minTime = Math.min(
                        ...recipes.map((recipe) => recipe.cooking_time),
                    );
                    const maxTime = Math.max(
                        ...recipes.map((recipe) => recipe.cooking_time),
                    );

                    setFastestRecipes(
                        recipes.filter(
                            (recipe) => recipe.cooking_time === minTime,
                        ),
                    );
                    setSlowestRecipes(
                        recipes.filter(
                            (recipe) => recipe.cooking_time === maxTime,
                        ),
                    );

                    // find recipes by number of ingredients
                    const maxIngredients = Math.max(
                        ...recipes.map((recipe) => recipe.ingredients.length),
                    );
                    const minIngredients = Math.min(
                        ...recipes.map((recipe) => recipe.ingredients.length),
                    );

                    setMostIngredientsRecipes(
                        recipes.filter(
                            (recipe) =>
                                recipe.ingredients.length === maxIngredients,
                        ),
                    );
                    setLeastIngredientsRecipes(
                        recipes.filter(
                            (recipe) =>
                                recipe.ingredients.length === minIngredients,
                        ),
                    );
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        void fetchStats();
    }, []);

    // chart options
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

    // chart series data
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
                        Recipe Statistics
                    </h1>
                </div>

                <div className="flex justify-between">
                    {/* Chart */}
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
                                document={
                                    <StatsReport
                                        reportTime={reportTime ?? new Date()}
                                        stats={stats}
                                    />
                                }
                                fileName="Statistics_Report.pdf"
                                onClick={handleGenerateReport}
                                className="bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
                            >
                                Statistics Report PDF
                            </PDFDownloadLink>

                            <PDFDownloadLink
                                document={
                                    <StatsReportSecond
                                        reportTime={reportTime ?? new Date()}
                                    />
                                }
                                fileName="Statistics_Second_Report.pdf"
                                onClick={handleGenerateReport}
                                className="bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
                            >
                                Statistics Report PDF - Option 2
                            </PDFDownloadLink>
                        </div>
                    </div>

                    {/* List of recipe types and details */}
                    <div className="ml-6 flex flex-col">
                        <h2 className="text-h3 font-semibold mb-4">
                            Recipe Types Summary
                        </h2>
                        <ul className="space-y-2">
                            {stats.map((stat) => (
                                <li
                                    key={stat.typeName}
                                    className="flex justify-between bg-gray-100 p-2 rounded-md"
                                >
                                    <span className="font-medium">
                                        {stat.typeName}
                                    </span>
                                    <span className="text-gray-600">
                                        {stat.count}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4">
                            <h2 className="text-h3 font-semibold mb-2">
                                Recipe Details
                            </h2>
                            <div>
                                <strong>Fastest Recipes:</strong>
                                <ul>
                                    {fastestRecipes.map((recipe) => (
                                        <li key={recipe.id}>
                                            {recipe.title} (
                                            {recipe.cooking_time} min)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Slowest Recipes:</strong>
                                <ul>
                                    {slowestRecipes.map((recipe) => (
                                        <li key={recipe.id}>
                                            {recipe.title} (
                                            {recipe.cooking_time} min)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Recipes with Most Ingredients:</strong>
                                <ul>
                                    {mostIngredientsRecipes.map((recipe) => (
                                        <li key={recipe.id}>
                                            {recipe.title} (
                                            {recipe.ingredients.length}{" "}
                                            ingredients)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Recipes with Least Ingredients:</strong>
                                <ul>
                                    {leastIngredientsRecipes.map((recipe) => (
                                        <li key={recipe.id}>
                                            {recipe.title} (
                                            {recipe.ingredients.length}{" "}
                                            ingredients)
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
