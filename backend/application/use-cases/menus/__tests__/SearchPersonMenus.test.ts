import SearchPersonMenus from "../SearchPersonMenus";

describe("SearchPersonMenus", () => {
    it("should search person menus with filters and return the repository result", async () => {
        const filters = { menuTitle: "weekly" };
        const menus = [{ id: 9, menuTitle: "Weekly menu" }];
        const menuRepository = {
            searchByPerson: jest.fn().mockResolvedValue(menus),
        };
        const useCase = new SearchPersonMenus(menuRepository);

        const result = await useCase.execute(7, filters);

        expect(menuRepository.searchByPerson).toHaveBeenCalledWith(7, filters);
        expect(result).toEqual(menus);
    });
});
