import UpdateMenu from "@application/use-cases/menus/UpdateMenu";
import Menu from "@domain/entities/Menu";
import { NotFoundError, ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function makeInput() {
    return {
        menuTitle: "Weekly menu",
        menuContent: "A simple dinner plan",
        categoryId: 2,
        recipeIds: [3, 5],
    };
}

function setup() {
    const menuRepository = { update: jest.fn() };
    const useCase = new UpdateMenu(menuRepository);

    return { useCase, menuRepository };
}

describe("UpdateMenu", () => {
    it("should update a menu entity with recipe ids", async () => {
        const { useCase, menuRepository } = setup();
        const input = makeInput();
        menuRepository.update.mockResolvedValue(true);

        const result = await useCase.execute(9, 7, input);
        const [id, personId, menu, recipeIds] =
            menuRepository.update.mock.calls[0];

        expect(id).toBe(9);
        expect(personId).toBe(7);
        expect(menu).toBeInstanceOf(Menu);
        expect(menu).toMatchObject({
            menuTitle: input.menuTitle,
            menuContent: input.menuContent,
            categoryId: input.categoryId,
        });
        expect(recipeIds).toEqual(input.recipeIds);
        expect(menuRepository.update).toHaveBeenCalledWith(
            9,
            7,
            menu,
            input.recipeIds,
        );
        expect(result).toBeUndefined();
    });

    it("should throw a 404 NotFoundError when the menu does not belong to the user", async () => {
        const { useCase, menuRepository } = setup();
        menuRepository.update.mockResolvedValue(false);

        const error = await catchError(useCase.execute(9, 7, makeInput()));

        expect(error).toBeAppError(NotFoundError, "Menu not found", 404);
    });

    it("should throw a 400 ValidationError and not update when input is invalid", async () => {
        const { useCase, menuRepository } = setup();

        const error = await catchError(useCase.execute(null, 7, makeInput()));

        expect(error).toBeAppError(ValidationError, "ID is required", 400);
        expect(menuRepository.update).not.toHaveBeenCalled();
    });
});
