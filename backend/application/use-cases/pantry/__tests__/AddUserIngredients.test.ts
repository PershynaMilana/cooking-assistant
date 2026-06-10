import AddUserIngredients from "../AddUserIngredients";
import { ValidationError } from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

function setup() {
    const pantryRepository = { addIngredients: jest.fn() };
    const useCase = new AddUserIngredients(pantryRepository);

    return { useCase, pantryRepository };
}

describe("AddUserIngredients", () => {
    it("should throw a 400 ValidationError when ingredients are not an array", async () => {
        const { useCase, pantryRepository } = setup();

        const error = await catchError(
            useCase.execute(7, { id: 3, quantity: 2 }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "Incorrect data format",
            400,
        );
        expect(pantryRepository.addIngredients).not.toHaveBeenCalled();
    });

    it("should add user ingredients when ingredients are an array", async () => {
        const { useCase, pantryRepository } = setup();
        const ingredients = [{ id: 3, quantity: 2 }];

        const result = await useCase.execute(7, ingredients);

        expect(pantryRepository.addIngredients).toHaveBeenCalledWith(
            7,
            ingredients,
        );
        expect(result).toBeUndefined();
    });
});
