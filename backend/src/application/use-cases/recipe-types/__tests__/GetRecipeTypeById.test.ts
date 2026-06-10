import GetRecipeTypeById from "@application/use-cases/recipe-types/GetRecipeTypeById";
import { NotFoundError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function setup() {
    const recipeTypeRepository = { findById: jest.fn() };
    const useCase = new GetRecipeTypeById(recipeTypeRepository);

    return { useCase, recipeTypeRepository };
}

describe("GetRecipeTypeById", () => {
    it("should throw a 404 NotFoundError when the recipe type does not exist", async () => {
        const { useCase, recipeTypeRepository } = setup();
        recipeTypeRepository.findById.mockResolvedValue(null);

        const error = await catchError(useCase.execute(2));

        expect(error).toBeAppError(NotFoundError, "Recipe type not found", 404);
    });

    it("should return the recipe type when it exists", async () => {
        const { useCase, recipeTypeRepository } = setup();
        const type = { id: 2, type_name: "Soup" };
        recipeTypeRepository.findById.mockResolvedValue(type);

        const result = await useCase.execute(2);

        expect(recipeTypeRepository.findById).toHaveBeenCalledWith(2);
        expect(result).toEqual(type);
    });
});
