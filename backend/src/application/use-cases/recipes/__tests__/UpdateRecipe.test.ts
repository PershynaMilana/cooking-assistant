import UpdateRecipe from "@application/use-cases/recipes/UpdateRecipe";
import Recipe from "@domain/entities/Recipe";
import { NotFoundError, ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function makeInput(overrides = {}) {
    return {
        title: "Tomato soup",
        content: "Boil tomatoes with stock",
        ingredients: [{ id: 3, quantity: 2 }],
        type_id: 1,
        cooking_time: 30,
        servings: 4,
        ...overrides,
    };
}

function setup() {
    const recipeRepository = { update: jest.fn() };
    const useCase = new UpdateRecipe(recipeRepository);

    return { useCase, recipeRepository };
}

describe("UpdateRecipe", () => {
    it("should update a recipe entity and return the repository result", async () => {
        const { useCase, recipeRepository } = setup();
        const input = makeInput();
        const updatedRecipe = { id: 12, ...input };
        recipeRepository.update.mockResolvedValue(updatedRecipe);

        const result = await useCase.execute(12, 7, input);
        const [id, personId, recipe] = recipeRepository.update.mock.calls[0];

        expect(id).toBe(12);
        expect(personId).toBe(7);
        expect(recipe).toBeInstanceOf(Recipe);
        expect(recipe).toMatchObject({
            title: input.title,
            content: input.content,
            ingredients: [{ id: 3, quantity_recipe_ingredients: 2 }],
            type_id: input.type_id,
            cooking_time: input.cooking_time,
            servings: input.servings,
        });
        expect(result).toEqual(updatedRecipe);
    });

    it("should accept servings sent as a numeric string", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.update.mockResolvedValue({ id: 12 });

        await useCase.execute(12, 7, makeInput({ servings: "4" }));
        const [, , recipe] = recipeRepository.update.mock.calls[0];

        expect(recipe).toMatchObject({ servings: 4 });
    });

    it("should throw a 404 NotFoundError when the recipe does not belong to the user", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.update.mockResolvedValue(null);

        const error = await catchError(useCase.execute(12, 7, makeInput()));

        expect(error).toBeAppError(NotFoundError, "Recipe not found", 404);
    });

    it("should throw a 400 ValidationError before updating when input is invalid", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(
            useCase.execute(12, 7, makeInput({ title: "" })),
        );

        expect(error).toBeAppError(
            ValidationError,
            "title: Title cannot be empty",
            400,
        );
        expect(recipeRepository.update).not.toHaveBeenCalled();
    });
});
