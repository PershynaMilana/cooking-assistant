import React from "react";
import { useTranslation } from "react-i18next";

import type { AverageCookingTime } from "types/stats";

interface MenuStatsSummaryProps {
    menusCount: number;
    recipesCount: number;
    averageCookingTimes: AverageCookingTime[];
}

export const MenuStatsSummary: React.FC<MenuStatsSummaryProps> = ({
    menusCount,
    recipesCount,
    averageCookingTimes,
}) => {
    const { t } = useTranslation("stats");

    return (
        <div className="flex flex-col">
            <ul className="space-y-2">
                <li className="flex justify-between bg-gray-100 rounded-lg p-3">
                    <span className="font-medium">
                        {t("statsPage.totalMenus", { count: menusCount })}
                    </span>
                </li>
                <li className="flex justify-between bg-gray-100 rounded-lg p-3">
                    <span className="font-medium">
                        {t("statsPage.totalRecipes", { count: recipesCount })}
                    </span>
                </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-h3 font-semibold text-dark-purple mb-3">
                    {t("statsPage.avgCookingTime")}
                </h2>
                <ul className="space-y-2">
                    {averageCookingTimes.map((entry) => (
                        <li
                            key={entry.typeName}
                            className="flex justify-between bg-gray-100 rounded-lg p-3"
                        >
                            <span className="font-medium">
                                {entry.typeName}
                            </span>
                            <span className="text-gray-600">
                                {entry.averageCookingTime}
                                {t("statsPage.timeUnit")}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
