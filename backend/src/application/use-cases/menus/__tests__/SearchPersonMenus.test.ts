import SearchPersonMenus from "@application/use-cases/menus/SearchPersonMenus";
import { ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function setup() {
    const menuRepository = { searchByPerson: jest.fn() };
    const useCase = new SearchPersonMenus(menuRepository);

    return { useCase, menuRepository };
}

describe("SearchPersonMenus", () => {
    it("should search person menus with filters and return the repository result", async () => {
        const { useCase, menuRepository } = setup();
        const filters = { menu_name: "weekly" };
        const menus = [{ id: 9, menuTitle: "Weekly menu" }];
        menuRepository.searchByPerson.mockResolvedValue(menus);

        const result = await useCase.execute(7, filters);

        expect(menuRepository.searchByPerson).toHaveBeenCalledWith(7, filters);
        expect(result).toEqual(menus);
    });

    it("should throw a 400 ValidationError when category_ids is not an id list", async () => {
        const { useCase, menuRepository } = setup();

        const error = await catchError(
            useCase.execute(7, { category_ids: "abc" }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "category_ids: Category IDs must be a comma-separated list of IDs",
            400,
        );
        expect(menuRepository.searchByPerson).not.toHaveBeenCalled();
    });
});
