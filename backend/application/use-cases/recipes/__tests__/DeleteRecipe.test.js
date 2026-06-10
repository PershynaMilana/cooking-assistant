const DeleteRecipe = require("../DeleteRecipe");
const { NotFoundError } = require("../../../../domain/errors/AppError");
const { catchError } = require("../../../../test/helpers/assertions");

function setup() {
    const recipeRepository = { deleteById: jest.fn() };
    const useCase = new DeleteRecipe(recipeRepository);

    return { useCase, recipeRepository };
}

describe("DeleteRecipe", () => {
    it("should throw a 404 NotFoundError when the recipe does not exist", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.deleteById.mockResolvedValue(false);

        const error = await catchError(useCase.execute(12));

        expect(error).toBeAppError(NotFoundError, "Recipe not found", 404);
    });

    it("should delete the recipe when it exists", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.deleteById.mockResolvedValue(true);

        const result = await useCase.execute(12);

        expect(recipeRepository.deleteById).toHaveBeenCalledWith(12);
        expect(result).toBeUndefined();
    });
});
