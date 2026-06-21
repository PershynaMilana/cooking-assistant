import { NotFoundError } from "domain/errors/AppError";

import DeleteRecipe from "application/use-cases/recipes/DeleteRecipe";

import { catchError } from "test/helpers/assertions";

function setup() {
    const recipeRepository = { deleteById: jest.fn() };
    const useCase = new DeleteRecipe(recipeRepository);

    return { useCase, recipeRepository };
}

describe("DeleteRecipe", () => {
    it("should throw a 404 NotFoundError when the recipe does not belong to the user", async () => {
        const { useCase, recipeRepository } = setup();

        recipeRepository.deleteById.mockResolvedValue(false);

        const error = await catchError(useCase.execute(12, 7));

        expect(error).toBeAppError(NotFoundError, "Recipe not found", 404);
    });

    it("should delete the recipe when it belongs to the user", async () => {
        const { useCase, recipeRepository } = setup();

        recipeRepository.deleteById.mockResolvedValue(true);

        await useCase.execute(12, 7);

        expect(recipeRepository.deleteById).toHaveBeenCalledWith(12, 7);
    });
});
