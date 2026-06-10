import GetAllIngredients from "@application/use-cases/recipes/GetAllIngredients";

describe("GetAllIngredients", () => {
    it("should return all ingredients from the repository", async () => {
        const ingredients = [{ id: 3, ingredient_name: "Tomato" }];
        const recipeRepository = {
            findAllIngredients: jest.fn().mockResolvedValue(ingredients),
        };
        const useCase = new GetAllIngredients(recipeRepository);

        const result = await useCase.execute();

        expect(recipeRepository.findAllIngredients).toHaveBeenCalledWith();
        expect(result).toEqual(ingredients);
    });
});
