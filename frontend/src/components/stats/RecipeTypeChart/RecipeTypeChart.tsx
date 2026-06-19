import React from "react";
import Chart from "react-apexcharts";

import type { RecipeTypeStat } from "hooks/useRecipeStatistics";

interface RecipeTypeChartProps {
    stats: RecipeTypeStat[];
}

export const RecipeTypeChart: React.FC<RecipeTypeChartProps> = ({ stats }) => {
    const options: ApexCharts.ApexOptions = {
        chart: { type: "pie" },
        labels: stats.map((stat) => stat.typeName),
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { position: "bottom" },
                },
            },
        ],
    };
    const series = stats.map((stat) => stat.count);

    return (
        <Chart
            options={options}
            series={series}
            type="pie"
            width="500"
            height="auto"
        />
    );
};
