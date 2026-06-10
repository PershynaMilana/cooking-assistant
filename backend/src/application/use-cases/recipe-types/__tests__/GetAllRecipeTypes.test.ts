import GetAllRecipeTypes from "@application/use-cases/recipe-types/GetAllRecipeTypes";

describe("GetAllRecipeTypes", () => {
    it("should return all recipe types from the repository", async () => {
        const types = [{ id: 2, type_name: "Soup" }];
        const recipeTypeRepository = {
            findAll: jest.fn().mockResolvedValue(types),
        };
        const useCase = new GetAllRecipeTypes(recipeTypeRepository);

        const result = await useCase.execute();

        expect(recipeTypeRepository.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(types);
    });
});
