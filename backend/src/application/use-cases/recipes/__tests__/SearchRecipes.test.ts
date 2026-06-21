import { ValidationError } from "domain/errors/AppError";

import SearchRecipes from "application/use-cases/recipes/SearchRecipes";

import { catchError } from "test/helpers/assertions";

function setup() {
    const recipeRepository = { search: jest.fn() };
    const useCase = new SearchRecipes(recipeRepository);

    return { useCase, recipeRepository };
}

describe("SearchRecipes", () => {
    it("should search recipes with filters and return the repository result", async () => {
        const { useCase, recipeRepository } = setup();
        const filters = {
            ingredient_name: "tomato",
            type_ids: "1,2",
            min_cooking_time: "10",
            sort_order: "asc",
        };
        const recipes = [{ id: 1, title: "Tomato soup" }];

        recipeRepository.search.mockResolvedValue(recipes);

        const result = await useCase.execute(filters);

        expect(recipeRepository.search).toHaveBeenCalledWith({
            ingredient_name: "tomato",
            type_ids: "1,2",
            min_cooking_time: 10,
            sort_order: "asc",
        });
        expect(result).toEqual(recipes);
    });

    it("should throw a 400 ValidationError when type_ids is not an id list", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(useCase.execute({ type_ids: "abc" }));

        expect(error).toBeAppError(
            ValidationError,
            "type_ids: Type IDs must be a comma-separated list of IDs",
            400,
        );
        expect(recipeRepository.search).not.toHaveBeenCalled();
    });

    it("should throw a 400 ValidationError when sort_order is unknown", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(useCase.execute({ sort_order: "junk" }));

        expect(error).toBeAppError(
            ValidationError,
            "sort_order: Invalid enum value. Expected 'asc' | 'desc', received 'junk'",
            400,
        );
        expect(recipeRepository.search).not.toHaveBeenCalled();
    });
});
