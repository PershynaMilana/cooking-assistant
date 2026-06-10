const SearchRecipes = require("../SearchRecipes");

describe("SearchRecipes", () => {
    it("should search recipes with filters and return the repository result", async () => {
        const filters = { title: "soup", type_id: 2 };
        const recipes = [{ id: 1, title: "Tomato soup" }];
        const recipeRepository = {
            search: jest.fn().mockResolvedValue(recipes),
        };
        const useCase = new SearchRecipes(recipeRepository);

        const result = await useCase.execute(filters);

        expect(recipeRepository.search).toHaveBeenCalledWith(filters);
        expect(result).toEqual(recipes);
    });
});
