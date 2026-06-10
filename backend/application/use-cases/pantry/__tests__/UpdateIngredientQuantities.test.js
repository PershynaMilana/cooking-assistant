const UpdateIngredientQuantities = require("../UpdateIngredientQuantities");
const { ValidationError } = require("../../../../domain/errors/AppError");
const { catchError } = require("../../../../test/helpers/assertions");

function setup() {
    const pantryRepository = { updateQuantities: jest.fn() };
    const useCase = new UpdateIngredientQuantities(pantryRepository);

    return { useCase, pantryRepository };
}

describe("UpdateIngredientQuantities", () => {
    it("should throw a 400 ValidationError when updated ingredients are not an array", async () => {
        const { useCase, pantryRepository } = setup();

        const error = await catchError(
            useCase.execute(7, { id: 3, quantity: 2 }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "Incorrect data format",
            400,
        );
        expect(pantryRepository.updateQuantities).not.toHaveBeenCalled();
    });

    it("should update user ingredient quantities when items are an array", async () => {
        const { useCase, pantryRepository } = setup();
        const items = [{ id: 3, quantity: 2 }];

        const result = await useCase.execute(7, items);

        expect(pantryRepository.updateQuantities).toHaveBeenCalledWith(
            7,
            items,
        );
        expect(result).toBeUndefined();
    });
});
