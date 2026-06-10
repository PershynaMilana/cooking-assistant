import UpdatePurchaseQuantity from "../UpdatePurchaseQuantity";
import {
    NotFoundError,
    ValidationError,
} from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

function setup() {
    const pantryRepository = { updatePurchaseQuantity: jest.fn() };
    const useCase = new UpdatePurchaseQuantity(pantryRepository);

    return { useCase, pantryRepository };
}

describe("UpdatePurchaseQuantity", () => {
    it("should throw a 400 ValidationError when quantity is undefined", async () => {
        const { useCase, pantryRepository } = setup();

        const error = await catchError(useCase.execute(7, 12, undefined));

        expect(error).toBeAppError(
            ValidationError,
            "Quantity cannot be empty.",
            400,
        );
        expect(pantryRepository.updatePurchaseQuantity).not.toHaveBeenCalled();
    });

    it("should throw a 404 NotFoundError when the purchase does not exist", async () => {
        const { useCase, pantryRepository } = setup();
        pantryRepository.updatePurchaseQuantity.mockResolvedValue(false);

        const error = await catchError(useCase.execute(7, 12, 3));

        expect(error).toBeAppError(NotFoundError, "Purchase not found.", 404);
    });

    it("should update the purchase quantity when the purchase exists", async () => {
        const { useCase, pantryRepository } = setup();
        pantryRepository.updatePurchaseQuantity.mockResolvedValue(true);

        const result = await useCase.execute(7, 12, 0);

        expect(pantryRepository.updatePurchaseQuantity).toHaveBeenCalledWith(
            7,
            12,
            0,
        );
        expect(result).toBeUndefined();
    });
});
