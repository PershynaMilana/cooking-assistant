const Recipe = require("../Recipe");
const { ValidationError } = require("../../errors/AppError");
const { catchSyncError } = require("../../../test/helpers/assertions");

function makeCreationInput(overrides = {}) {
    return {
        title: "Tomato soup",
        content: "Boil tomatoes with stock",
        person_id: 7,
        ingredients: [{ id: 3, quantity: 2 }],
        type_id: 1,
        cooking_time: 30,
        servings: 4,
        ...overrides,
    };
}

function catchCreationError(overrides) {
    return catchSyncError(() => {
        Recipe.forCreation(makeCreationInput(overrides));
    });
}

function catchUpdateError(input) {
    return catchSyncError(() => {
        Recipe.forUpdate(input);
    });
}

describe("Recipe", () => {
    it("should throw a 400 ValidationError when creation ingredients are not an array", () => {
        const error = catchCreationError({ ingredients: "tomatoes" });

        expect(error).toBeAppError(
            ValidationError,
            "Ingredients cannot be empty",
            400,
        );
    });

    it("should throw a 400 ValidationError when creation ingredients are empty", () => {
        const error = catchCreationError({ ingredients: [] });

        expect(error).toBeAppError(
            ValidationError,
            "Ingredients cannot be empty",
            400,
        );
    });

    it("should throw a 400 ValidationError when a creation ingredient has no id", () => {
        const error = catchCreationError({ ingredients: [{ quantity: 2 }] });

        expect(error).toBeAppError(
            ValidationError,
            "All ingredients must have id",
            400,
        );
    });

    it("should create a recipe with all creation fields", () => {
        const input = makeCreationInput();

        const recipe = Recipe.forCreation(input);

        expect(recipe).toBeInstanceOf(Recipe);
        expect(Object.keys(recipe)).toEqual([
            "title",
            "content",
            "person_id",
            "ingredients",
            "type_id",
            "cooking_time",
            "servings",
        ]);
        expect(recipe).toMatchObject(input);
    });

    it("should allow empty title and content when creating a recipe", () => {
        const input = makeCreationInput({
            title: "",
            content: "",
        });

        const recipe = Recipe.forCreation(input);

        expect(recipe.title).toBe("");
        expect(recipe.content).toBe("");
    });

    it("should throw a 400 ValidationError for update title and content before checking ingredients", () => {
        const error = catchUpdateError({
            title: "",
            content: "",
            ingredients: [],
        });

        expect(error).toBeAppError(
            ValidationError,
            "Title and content cannot be empty",
            400,
        );
    });

    it("should throw a 400 ValidationError when update ingredients are empty", () => {
        const error = catchUpdateError(makeCreationInput({ ingredients: [] }));

        expect(error).toBeAppError(
            ValidationError,
            "Ingredients cannot be empty",
            400,
        );
    });

    it("should throw a 400 ValidationError when an update ingredient has no id", () => {
        const error = catchUpdateError(
            makeCreationInput({ ingredients: [{ quantity: 2 }] }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "All ingredients must have id",
            400,
        );
    });

    it("should create an update recipe without person_id", () => {
        const input = makeCreationInput();

        const recipe = Recipe.forUpdate(input);

        expect(recipe).toBeInstanceOf(Recipe);
        expect(Object.keys(recipe)).toEqual([
            "title",
            "content",
            "ingredients",
            "type_id",
            "cooking_time",
            "servings",
        ]);
        expect(recipe).toMatchObject({
            title: input.title,
            content: input.content,
            ingredients: input.ingredients,
            type_id: input.type_id,
            cooking_time: input.cooking_time,
            servings: input.servings,
        });
        expect(recipe).not.toHaveProperty("person_id");
    });
});
