import GetAllMenuCategories from "@application/use-cases/menu-categories/GetAllMenuCategories";

describe("GetAllMenuCategories", () => {
    it("should return all menu categories from the repository", async () => {
        const categories = [{ id: 2, category_name: "Dinner" }];
        const menuCategoryRepository = {
            findAll: jest.fn().mockResolvedValue(categories),
        };
        const useCase = new GetAllMenuCategories(menuCategoryRepository);

        const result = await useCase.execute();

        expect(menuCategoryRepository.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(categories);
    });
});
