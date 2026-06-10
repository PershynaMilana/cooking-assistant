export interface RecipeFilters {
    ingredient_name?: string;
    type_ids?: string;
    start_date?: string;
    end_date?: string;
    min_cooking_time?: string | number;
    max_cooking_time?: string | number;
    sort_order?: string;
    [key: string]: unknown;
}
