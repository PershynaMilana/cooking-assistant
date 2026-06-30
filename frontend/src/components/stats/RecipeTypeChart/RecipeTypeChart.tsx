import React, { Suspense } from "react";

import type { RecipeTypeStat } from "types/stats";

const LazyPieChart = React.lazy(() => import("./PieChart"));

interface RecipeTypeChartProps {
    stats: RecipeTypeStat[];
}

const CENTERING_STYLE: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
};

export const RecipeTypeChart = ({ stats }: RecipeTypeChartProps) => (
    <Suspense
        fallback={<div style={{ width: 240, height: 240, margin: "0 auto" }} />}
    >
        <div style={CENTERING_STYLE}>
            <LazyPieChart stats={stats} />
        </div>
    </Suspense>
);
