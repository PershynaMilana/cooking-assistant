import type { RecipeFiltersState } from "redux/slices/filtersSlice";

import { buildRecipeFilterParams } from "utils/recipeFilterParams";

const EMPTY: RecipeFiltersState = {
    selectedTypes: [],
    startDate: "",
    endDate: "",
    minCookingTime: "",
    maxCookingTime: "",
    sortOrder: "asc",
};

describe("buildRecipeFilterParams", () => {
    it("should build minimal params with an empty ingredient name when none is given", () => {
        expect(buildRecipeFilterParams(EMPTY, null)).toEqual({
            ingredient_name: "",
            sort_order: "asc",
            type_ids: undefined,
            start_date: undefined,
            end_date: undefined,
            min_cooking_time: undefined,
            max_cooking_time: undefined,
        });
    });

    it("should map all set fields into the query params", () => {
        const filters: RecipeFiltersState = {
            selectedTypes: [1, 2],
            startDate: "2024-01-01",
            endDate: "2024-02-01",
            minCookingTime: "10",
            maxCookingTime: "90",
            sortOrder: "desc",
        };

        expect(buildRecipeFilterParams(filters, "egg")).toEqual({
            ingredient_name: "egg",
            sort_order: "desc",
            type_ids: "1,2",
            start_date: "2024-01-01",
            end_date: "2024-02-01",
            min_cooking_time: "10",
            max_cooking_time: "90",
        });
    });
});
