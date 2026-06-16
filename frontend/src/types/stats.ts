export interface AverageCookingTime {
    typeName: string;
    averageCookingTime: string;
}

export interface RecipesStatsResponse {
    averageCookingTimes: AverageCookingTime[];
}
