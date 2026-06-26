import type { RecipeListItem } from "types/recipe";

import { sortRecipes } from "utils/sortRecipes";

const make = (
    id: number,
    title: string,
    cooking_time: number,
): RecipeListItem => ({
    id,
    title,
    type_name: "Any",
    creation_date: "2024-01-01",
    cooking_time,
});

const A = make(1, "Borscht", 60);
const B = make(2, "Varenyky", 45);
const C = make(3, "Apple", 45);

describe("sortRecipes", () => {
    it("should sort ascending by cooking time then title", () => {
        expect(sortRecipes([A, B, C], "asc")).toEqual([C, B, A]);
    });

    it("should sort descending by cooking time then title", () => {
        expect(sortRecipes([A, B, C], "desc")).toEqual([A, C, B]);
    });

    it("should not mutate the input array", () => {
        const input = [A, B];

        sortRecipes(input, "asc");

        expect(input).toEqual([A, B]);
    });
});
