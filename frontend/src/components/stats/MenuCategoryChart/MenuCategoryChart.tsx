import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";

import type { MenuCategoryStat } from "types/stats";

const LazyPieChartCard = React.lazy(
    () => import("components/stats/PieChartCard/PieChartCard"),
);

interface MenuCategoryChartProps {
    categories: MenuCategoryStat[];
}

const CENTERING_STYLE: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
};

export const MenuCategoryChart = ({ categories }: MenuCategoryChartProps) => {
    const { t } = useTranslation("stats");
    const data = categories.map((c) => ({
        name: c.categoryname,
        value: c.menuCount,
    }));

    return (
        <Suspense
            fallback={
                <div style={{ width: 240, height: 240, margin: "0 auto" }} />
            }
        >
            <div style={CENTERING_STYLE}>
                <LazyPieChartCard
                    data={data}
                    centerLabel={t("statsPage.menusLabel")}
                />
            </div>
        </Suspense>
    );
};
