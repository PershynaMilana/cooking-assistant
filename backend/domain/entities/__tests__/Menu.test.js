const Menu = require("../Menu");
const { ValidationError } = require("../../errors/AppError");
const { catchSyncError } = require("../../../test/helpers/assertions");

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

function catchCreationError(overrides) {
    return catchSyncError(() => {
        Menu.forCreation(makeInput(overrides));
    });
}

function catchUpdateError(id, overrides) {
    return catchSyncError(() => {
        Menu.forUpdate(id, makeInput(overrides));
    });
}

describe("Menu", () => {
    it("should throw a 400 ValidationError when creation menuTitle is missing", () => {
        const error = catchCreationError({ menuTitle: "" });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to create menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when creation categoryId is missing", () => {
        const error = catchCreationError({ categoryId: null });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to create menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when creation recipeIds are missing", () => {
        const error = catchCreationError({ recipeIds: undefined });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to create menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when creation recipeIds are empty", () => {
        const error = catchCreationError({ recipeIds: [] });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to create menu",
            400,
        );
    });

    it("should create a menu with creation fields", () => {
        const input = makeInput();

        const menu = Menu.forCreation(input);

        expect(menu).toBeInstanceOf(Menu);
        expect(Object.keys(menu)).toEqual([
            "menuTitle",
            "menuContent",
            "categoryId",
            "personId",
        ]);
        expect(menu).toMatchObject({
            menuTitle: input.menuTitle,
            menuContent: input.menuContent,
            categoryId: input.categoryId,
            personId: input.personId,
        });
    });

    it("should throw a 400 ValidationError when update id is missing", () => {
        const error = catchUpdateError(null);

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to update menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when update menuTitle is missing", () => {
        const error = catchUpdateError(4, { menuTitle: "" });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to update menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when update categoryId is missing", () => {
        const error = catchUpdateError(4, { categoryId: null });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to update menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when update recipeIds are missing", () => {
        const error = catchUpdateError(4, { recipeIds: undefined });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to update menu",
            400,
        );
    });

    it("should throw a 400 ValidationError when update recipeIds are empty", () => {
        const error = catchUpdateError(4, { recipeIds: [] });

        expect(error).toBeAppError(
            ValidationError,
            "Insufficient data to update menu",
            400,
        );
    });

    it("should create an update menu without personId", () => {
        const input = makeInput();

        const menu = Menu.forUpdate(4, input);

        expect(menu).toBeInstanceOf(Menu);
        expect(Object.keys(menu)).toEqual([
            "menuTitle",
            "menuContent",
            "categoryId",
        ]);
        expect(menu).toMatchObject({
            menuTitle: input.menuTitle,
            menuContent: input.menuContent,
            categoryId: input.categoryId,
        });
        expect(menu).not.toHaveProperty("personId");
    });
});
