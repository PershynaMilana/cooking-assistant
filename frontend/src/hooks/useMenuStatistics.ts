import { useEffect, useRef, useState } from "react";

import type { AverageCookingTime, MenuCategoryStat } from "types/stats";

import { getApiErrorMessage } from "api/httpError";
import { getMenus } from "api/menusApi";
import { getRecipes } from "api/recipesApi";
import { getRecipesStats } from "api/statsApi";

import { formatCookingTimeInput } from "utils/cookingTimeUtils";
import { getUserIdSafe } from "utils/getCurrentUserId";

export interface MenuStatisticsResult {
    menusCount: number;
    recipesCount: number;
    averageCookingTimes: AverageCookingTime[];
    menuCountByCategory: MenuCategoryStat[];
    error: string | null;
}

export const useMenuStatistics = (
    recipesCountProp: number | null = null,
): MenuStatisticsResult => {
    const [menusCount, setMenusCount] = useState(0);
    const [localRecipesCount, setLocalRecipesCount] = useState(0);
    const [averageCookingTimes, setAverageCookingTimes] = useState<
        AverageCookingTime[]
    >([]);
    const [menuCountByCategory, setMenuCountByCategory] = useState<
        MenuCategoryStat[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    const recipesCountRef = useRef(recipesCountProp);

    recipesCountRef.current = recipesCountProp;

    useEffect(() => {
        if (getUserIdSafe() === null) {
            setError("No auth token found.");

            return;
        }

        const fetchAll = async () => {
            setError(null);
            try {
                const recipesNeeded = recipesCountRef.current === null;
                const [allMenus, allRecipes, statsData] = await Promise.all([
                    getMenus({}),
                    recipesNeeded ? getRecipes() : Promise.resolve([]),
                    getRecipesStats(),
                ]);

                setMenusCount(allMenus.length);

                const categoryCounts: Record<string, number> = {};

                allMenus.forEach((menu) => {
                    categoryCounts[menu.categoryname] =
                        (categoryCounts[menu.categoryname] || 0) + 1;
                });
                setMenuCountByCategory(
                    Object.entries(categoryCounts).map(
                        ([categoryname, menuCount]) => ({
                            categoryname,
                            menuCount,
                        }),
                    ),
                );

                if (recipesNeeded) {
                    setLocalRecipesCount(allRecipes.length);
                }

                if (Array.isArray(statsData.averageCookingTimes)) {
                    setAverageCookingTimes(
                        statsData.averageCookingTimes.map((item) => {
                            const minutes = parseFloat(item.averageCookingTime);

                            return {
                                typeName: item.typeName,
                                averageCookingTime: formatCookingTimeInput(
                                    isNaN(minutes) ? 0 : Math.round(minutes),
                                ),
                            };
                        }),
                    );
                } else {
                    setAverageCookingTimes([]);
                }
            } catch (err) {
                setError(getApiErrorMessage(err));
            }
        };

        void fetchAll();
    }, []);

    return {
        menusCount,
        recipesCount: recipesCountProp ?? localRecipesCount,
        averageCookingTimes,
        menuCountByCategory,
        error,
    };
};
