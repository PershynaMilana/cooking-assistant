import GetAllMenus from "@application/use-cases/menus/GetAllMenus";

describe("GetAllMenus", () => {
    it("should return all menus from the repository with filters", async () => {
        const filters = { menuTitle: "weekly" };
        const menus = [{ id: 9, menuTitle: "Weekly menu" }];
        const menuRepository = {
            findAll: jest.fn().mockResolvedValue(menus),
        };
        const useCase = new GetAllMenus(menuRepository);

        const result = await useCase.execute(filters);

        expect(menuRepository.findAll).toHaveBeenCalledWith(filters);
        expect(result).toEqual(menus);
    });
});
