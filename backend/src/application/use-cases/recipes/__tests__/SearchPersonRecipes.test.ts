import { ValidationError } from "domain/errors/AppError";

import SearchPersonRecipes from "application/use-cases/recipes/SearchPersonRecipes";

import { catchError } from "test/helpers/assertions";

function setup() {
    const recipeRepository = { searchByPerson: jest.fn() };
    const useCase = new SearchPersonRecipes(recipeRepository);

    return { useCase, recipeRepository };
}

describe("SearchPersonRecipes", () => {
    it("should search person recipes with filters and return the repository result", async () => {
        const { useCase, recipeRepository } = setup();
        const filters = { ingredient_name: "tomato", type_ids: "2" };
        const recipes = [{ id: 1, title: "Tomato soup" }];

        recipeRepository.searchByPerson.mockResolvedValue(recipes);

        const result = await useCase.execute(7, filters);

        expect(recipeRepository.searchByPerson).toHaveBeenCalledWith(
            7,
            filters,
        );
        expect(result).toEqual(recipes);
    });

    it("should throw a 400 ValidationError when a date filter is malformed", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(
            useCase.execute(7, { start_date: "junk" }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "start_date: Start date must be a YYYY-MM-DD date",
            400,
        );
        expect(recipeRepository.searchByPerson).not.toHaveBeenCalled();
    });
});
