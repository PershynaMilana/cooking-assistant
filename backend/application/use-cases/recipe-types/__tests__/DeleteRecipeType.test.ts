import DeleteRecipeType from "../DeleteRecipeType";
import { NotFoundError } from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

function setup() {
    const recipeTypeRepository = { deleteById: jest.fn() };
    const useCase = new DeleteRecipeType(recipeTypeRepository);

    return { useCase, recipeTypeRepository };
}

describe("DeleteRecipeType", () => {
    it("should throw a 404 NotFoundError when the recipe type does not exist", async () => {
        const { useCase, recipeTypeRepository } = setup();
        recipeTypeRepository.deleteById.mockResolvedValue(false);

        const error = await catchError(useCase.execute(2));

        expect(error).toBeAppError(NotFoundError, "Recipe type not found", 404);
    });

    it("should delete the recipe type when it exists", async () => {
        const { useCase, recipeTypeRepository } = setup();
        recipeTypeRepository.deleteById.mockResolvedValue(true);

        const result = await useCase.execute(2);

        expect(recipeTypeRepository.deleteById).toHaveBeenCalledWith(2);
        expect(result).toBeUndefined();
    });
});
