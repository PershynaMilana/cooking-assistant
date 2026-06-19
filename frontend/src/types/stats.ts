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
