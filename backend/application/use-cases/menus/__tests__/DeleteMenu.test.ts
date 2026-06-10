import DeleteMenu from "../DeleteMenu";
import {
    NotFoundError,
    ValidationError,
} from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

function setup() {
    const menuRepository = { deleteById: jest.fn() };
    const useCase = new DeleteMenu(menuRepository);

    return { useCase, menuRepository };
}

describe("DeleteMenu", () => {
    it("should throw a 400 ValidationError when the menu id is missing", async () => {
        const { useCase, menuRepository } = setup();

        const error = await catchError(useCase.execute(null));

        expect(error).toBeAppError(ValidationError, "Menu ID is required", 400);
        expect(menuRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should throw a 404 NotFoundError when the menu does not exist", async () => {
        const { useCase, menuRepository } = setup();
        menuRepository.deleteById.mockResolvedValue(false);

        const error = await catchError(useCase.execute(9));

        expect(error).toBeAppError(NotFoundError, "Menu not found", 404);
    });

    it("should delete the menu when it exists", async () => {
        const { useCase, menuRepository } = setup();
        menuRepository.deleteById.mockResolvedValue(true);

        const result = await useCase.execute(9);

        expect(menuRepository.deleteById).toHaveBeenCalledWith(9);
        expect(result).toBeUndefined();
    });
});
