const CreateRecipeType = require("../CreateRecipeType");

describe("CreateRecipeType", () => {
    const makeDeps = () => ({
        recipeTypeRepository: { create: jest.fn() },
    });

    it("should create a recipe type and return the repository result", async () => {
        const deps = makeDeps();
        const createdType = {
            id: 2,
            type_name: "Soup",
            description: "Warm bowls",
        };
        deps.recipeTypeRepository.create.mockResolvedValue(createdType);
        const useCase = new CreateRecipeType(deps.recipeTypeRepository);

        const result = await useCase.execute({
            type_name: "Soup",
            description: "Warm bowls",
        });

        expect(deps.recipeTypeRepository.create).toHaveBeenCalledWith({
            type_name: "Soup",
            description: "Warm bowls",
        });
        expect(result).toEqual(createdType);
    });
});
