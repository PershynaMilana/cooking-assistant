import GetRecipeStats from "../GetRecipeStats";

describe("GetRecipeStats", () => {
    it("should return recipe stats from the repository", async () => {
        const stats = { totalRecipes: 4 };
        const recipeRepository = {
            getStats: jest.fn().mockResolvedValue(stats),
        };
        const useCase = new GetRecipeStats(recipeRepository);

        const result = await useCase.execute();

        expect(recipeRepository.getStats).toHaveBeenCalledWith();
        expect(result).toEqual(stats);
    });
});
