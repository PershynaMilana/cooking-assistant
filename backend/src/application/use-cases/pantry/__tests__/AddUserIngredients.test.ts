import AddUserIngredients from "@application/use-cases/pantry/AddUserIngredients";
import { ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

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

    it("should throw a 400 ValidationError when a quantity is below 1", async () => {
        const { useCase, pantryRepository } = setup();

        const error = await catchError(
            useCase.execute(7, [{ id: 3, quantity_person_ingradient: 0 }]),
        );

        expect(error).toBeAppError(
            ValidationError,
            "0.quantity_person_ingradient: Quantity must be at least 1",
            400,
        );
        expect(pantryRepository.addIngredients).not.toHaveBeenCalled();
    });

    it("should add user ingredients when ingredients are an array", async () => {
        const { useCase, pantryRepository } = setup();
        const ingredients = [{ id: 3, quantity_person_ingradient: 2 }];

        const result = await useCase.execute(7, ingredients);

        expect(pantryRepository.addIngredients).toHaveBeenCalledWith(
            7,
            ingredients,
        );
        expect(result).toBeUndefined();
    });
});
