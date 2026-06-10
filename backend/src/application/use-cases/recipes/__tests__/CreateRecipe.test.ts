import CreateRecipe from "@application/use-cases/recipes/CreateRecipe";
import Recipe from "@domain/entities/Recipe";
import { ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function makeInput(overrides = {}) {
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

function setup() {
    const recipeRepository = { create: jest.fn() };
    const useCase = new CreateRecipe(recipeRepository);

    return { useCase, recipeRepository };
}

describe("CreateRecipe", () => {
    it("should create a recipe entity and return the repository result", async () => {
        const { useCase, recipeRepository } = setup();
        const input = makeInput();
        const createdRecipe = { id: 12, ...input };
        recipeRepository.create.mockResolvedValue(createdRecipe);

        const result = await useCase.execute(input);
        const recipe = recipeRepository.create.mock.calls[0][0];

        expect(recipe).toBeInstanceOf(Recipe);
        expect(recipe).toMatchObject(input);
        expect(recipeRepository.create).toHaveBeenCalledWith(recipe);
        expect(result).toEqual(createdRecipe);
    });

    it("should throw a 400 ValidationError and not create when input is invalid", async () => {
        const { useCase, recipeRepository } = setup();

        const error = await catchError(
            useCase.execute(makeInput({ ingredients: [] })),
        );

        expect(error).toBeAppError(
            ValidationError,
            "Ingredients cannot be empty",
            400,
        );
        expect(recipeRepository.create).not.toHaveBeenCalled();
    });
});
