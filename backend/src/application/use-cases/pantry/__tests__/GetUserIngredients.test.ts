import GetUserIngredients from "application/use-cases/pantry/GetUserIngredients";

describe("GetUserIngredients", () => {
    it("should return user ingredients from the repository", async () => {
        const ingredients = [{ id: 3, ingredient_name: "Tomato" }];
        const pantryRepository = {
            findByUser: jest.fn().mockResolvedValue(ingredients),
        };
        const useCase = new GetUserIngredients(pantryRepository);

        const result = await useCase.execute(7);

        expect(pantryRepository.findByUser).toHaveBeenCalledWith(7);
        expect(result).toEqual(ingredients);
    });
});
