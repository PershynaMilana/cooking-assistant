import CreateMenu from "@application/use-cases/menus/CreateMenu";
import Menu from "@domain/entities/Menu";
import { ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function makeInput(overrides = {}) {
    return {
        menuTitle: "Weekly menu",
        menuContent: "A simple dinner plan",
        categoryId: 2,
        personId: 7,
        recipeIds: [3, 5],
        ...overrides,
    };
}

function setup() {
    const menuRepository = { create: jest.fn() };
    const useCase = new CreateMenu(menuRepository);

    return { useCase, menuRepository };
}

describe("CreateMenu", () => {
    it("should create a menu entity with recipe ids and return the repository result", async () => {
        const { useCase, menuRepository } = setup();
        const input = makeInput();
        const createdMenu = { id: 9, menuTitle: input.menuTitle };
        menuRepository.create.mockResolvedValue(createdMenu);

        const result = await useCase.execute(input);
        const [menu, recipeIds] = menuRepository.create.mock.calls[0];

        expect(menu).toBeInstanceOf(Menu);
        expect(menu).toMatchObject({
            menuTitle: input.menuTitle,
            menuContent: input.menuContent,
            categoryId: input.categoryId,
            personId: input.personId,
        });
        expect(recipeIds).toEqual(input.recipeIds);
        expect(menuRepository.create).toHaveBeenCalledWith(
            menu,
            input.recipeIds,
        );
        expect(result).toEqual(createdMenu);
    });

    it("should throw a 400 ValidationError and not create when input is invalid", async () => {
        const { useCase, menuRepository } = setup();

        const error = await catchError(
            useCase.execute(makeInput({ recipeIds: [] })),
        );

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to create menu",
            400,
        );
        expect(menuRepository.create).not.toHaveBeenCalled();
    });
});
