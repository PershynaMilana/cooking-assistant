import UpdateRecipeType from "@application/use-cases/recipe-types/UpdateRecipeType";
import { NotFoundError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function makeInput() {
    return {
        type_name: "Soup",
        description: "Warm bowls",
    };
}

function setup() {
    const recipeTypeRepository = { update: jest.fn() };
    const useCase = new UpdateRecipeType(recipeTypeRepository);

    return { useCase, recipeTypeRepository };
}

describe("UpdateRecipeType", () => {
    it("should throw a 404 NotFoundError when the recipe type does not exist", async () => {
        const { useCase, recipeTypeRepository } = setup();
        recipeTypeRepository.update.mockResolvedValue(null);

        const error = await catchError(useCase.execute(2, makeInput()));

        expect(error).toBeAppError(NotFoundError, "Recipe type not found", 404);
    });

    it("should update the recipe type and return the repository result", async () => {
        const { useCase, recipeTypeRepository } = setup();
        const updatedType = {
            id: 2,
            type_name: "Soup",
            description: "Warm bowls",
        };
        const input = makeInput();
        recipeTypeRepository.update.mockResolvedValue(updatedType);

        const result = await useCase.execute(2, input);

        expect(recipeTypeRepository.update).toHaveBeenCalledWith(2, input);
        expect(result).toEqual(updatedType);
    });
});
