import GetMenuById from "../GetMenuById";
import {
    NotFoundError,
    ValidationError,
} from "../../../../domain/errors/AppError";
import { catchError } from "../../../../test/helpers/assertions";

function setup() {
    const menuRepository = { findByIdWithRecipes: jest.fn() };
    const useCase = new GetMenuById(menuRepository);

    return { useCase, menuRepository };
}

describe("GetMenuById", () => {
    it("should throw a 400 ValidationError when the menu id is missing", async () => {
        const { useCase, menuRepository } = setup();

        const error = await catchError(useCase.execute(null));

        expect(error).toBeAppError(ValidationError, "Menu ID is required", 400);
        expect(menuRepository.findByIdWithRecipes).not.toHaveBeenCalled();
    });

    it("should throw a 404 NotFoundError when the menu does not exist", async () => {
        const { useCase, menuRepository } = setup();
        menuRepository.findByIdWithRecipes.mockResolvedValue(null);

        const error = await catchError(useCase.execute(9));

        expect(error).toBeAppError(NotFoundError, "Menu not found", 404);
    });

    it("should return the menu when it exists", async () => {
        const { useCase, menuRepository } = setup();
        const menu = { id: 9, menuTitle: "Weekly menu" };
        menuRepository.findByIdWithRecipes.mockResolvedValue(menu);

        const result = await useCase.execute(9);

        expect(menuRepository.findByIdWithRecipes).toHaveBeenCalledWith(9);
        expect(result).toEqual(menu);
    });
});
