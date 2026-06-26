import type { RecipeWithIngredientNames } from "types/recipe";

export interface AverageCookingTime {
    typeName: string;
    averageCookingTime: string;
}

export interface RecipesStatsResponse {
    averageCookingTimes: AverageCookingTime[] | null;
}

export interface MenuCategoryStat {
    categoryname: string;
    menuCount: number;
}

export interface RecipeTypeStat {
    typeName: string;
    count: number;
}

export interface RecipeStatistics {
    stats: RecipeTypeStat[];
    recipesCount: number;
    fastestRecipes: RecipeWithIngredientNames[];
    slowestRecipes: RecipeWithIngredientNames[];
    mostIngredientsRecipes: RecipeWithIngredientNames[];
    leastIngredientsRecipes: RecipeWithIngredientNames[];
}

export interface MenuStatistics {
    menusCount: number;
    recipesCount: number;
    averageCookingTimes: AverageCookingTime[];
    menuCountByCategory: MenuCategoryStat[];
}
