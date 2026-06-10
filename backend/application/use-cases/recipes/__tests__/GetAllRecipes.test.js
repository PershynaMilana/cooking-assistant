const GetAllRecipes = require("../GetAllRecipes");

describe("GetAllRecipes", () => {
    it("should return all recipes with ingredients from the repository", async () => {
        const recipes = [{ id: 1, title: "Tomato soup" }];
        const recipeRepository = {
            findAllWithIngredients: jest.fn().mockResolvedValue(recipes),
        };
        const useCase = new GetAllRecipes(recipeRepository);

        const result = await useCase.execute();

        expect(recipeRepository.findAllWithIngredients).toHaveBeenCalledWith();
        expect(result).toEqual(recipes);
    });
});
