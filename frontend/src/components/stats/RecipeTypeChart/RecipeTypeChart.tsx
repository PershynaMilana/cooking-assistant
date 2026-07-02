import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";

import type { RecipeTypeStat } from "types/stats";

const LazyPieChartCard = React.lazy(
    () => import("components/stats/PieChartCard/PieChartCard"),
);

interface RecipeTypeChartProps {
    stats: RecipeTypeStat[];
}

const CENTERING_STYLE: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
};

export const RecipeTypeChart = ({ stats }: RecipeTypeChartProps) => {
    const { t } = useTranslation("stats");
    const data = stats.map((s) => ({ name: s.typeName, value: s.count }));

    return (
        <Suspense
            fallback={
                <div style={{ width: 240, height: 240, margin: "0 auto" }} />
            }
        >
            <div style={CENTERING_STYLE}>
                <LazyPieChartCard
                    data={data}
                    centerLabel={t("statsPage.recipesLabel")}
                />
            </div>
        </Suspense>
    );
};
