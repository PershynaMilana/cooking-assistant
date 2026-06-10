const SearchPersonRecipes = require("../SearchPersonRecipes");

describe("SearchPersonRecipes", () => {
    it("should search person recipes with filters and return the repository result", async () => {
        const filters = { title: "soup", type_id: 2 };
        const recipes = [{ id: 1, title: "Tomato soup" }];
        const recipeRepository = {
            searchByPerson: jest.fn().mockResolvedValue(recipes),
        };
        const useCase = new SearchPersonRecipes(recipeRepository);

        const result = await useCase.execute(7, filters);

        expect(recipeRepository.searchByPerson).toHaveBeenCalledWith(
            7,
            filters,
        );
        expect(result).toEqual(recipes);
    });
});
