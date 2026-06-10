import GetRecipeById from "@application/use-cases/recipes/GetRecipeById";
import { NotFoundError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function setup() {
    const recipeRepository = { findByIdWithIngredients: jest.fn() };
    const useCase = new GetRecipeById(recipeRepository);

    return { useCase, recipeRepository };
}

describe("GetRecipeById", () => {
    it("should throw a 404 NotFoundError when the recipe does not exist", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.findByIdWithIngredients.mockResolvedValue(null);

        const error = await catchError(useCase.execute(12));

        expect(error).toBeAppError(NotFoundError, "Recipe not found", 404);
    });

    it("should return the recipe when it exists", async () => {
        const { useCase, recipeRepository } = setup();
        const recipe = { id: 12, title: "Tomato soup" };
        recipeRepository.findByIdWithIngredients.mockResolvedValue(recipe);

        const result = await useCase.execute(12);

        expect(recipeRepository.findByIdWithIngredients).toHaveBeenCalledWith(
            12,
        );
        expect(result).toEqual(recipe);
    });
});
