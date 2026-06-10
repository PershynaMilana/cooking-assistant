import UpdateRecipe from "../UpdateRecipe";
import Recipe from "../../../../domain/entities/Recipe";
import {
    NotFoundError,
    ValidationError,
} from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

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

        const result = await useCase.execute(12, input);
        const [id, recipe] = recipeRepository.update.mock.calls[0];

        expect(id).toBe(12);
        expect(recipe).toBeInstanceOf(Recipe);
        expect(recipe).toMatchObject(input);
        expect(result).toEqual(updatedRecipe);
    });

    it("should throw a 404 NotFoundError when the recipe does not exist", async () => {
        const { useCase, recipeRepository } = setup();
        recipeRepository.update.mockResolvedValue(null);

        const error = await catchError(useCase.execute(12, makeInput()));

        expect(error).toBeAppError(NotFoundError, "Recipe not found", 404);
    });

    it("should throw a 400 ValidationError before updating when input is invalid", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(
            useCase.execute(12, makeInput({ title: "" })),
        );

        expect(error).toBeAppError(
            ValidationError,
            "Title and content cannot be empty",
            400,
        );
        expect(recipeRepository.update).not.toHaveBeenCalled();
    });
});
