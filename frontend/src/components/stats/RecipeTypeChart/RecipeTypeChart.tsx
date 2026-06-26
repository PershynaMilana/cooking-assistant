import React, { Suspense } from "react";

const Chart = React.lazy(() => import("./LazyChart"));

import type { RecipeTypeStat } from "types/stats";

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
        <Suspense fallback={<div style={{ width: 500, height: 300 }} />}>
            <Chart
                options={options}
                series={series}
                type="pie"
                width="500"
                height="auto"
            />
        </Suspense>
    );
};
