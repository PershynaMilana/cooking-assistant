import CreateRecipeType from "@application/use-cases/recipe-types/CreateRecipeType";
import { ValidationError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

describe("CreateRecipeType", () => {
    const makeDeps = () => ({
        recipeTypeRepository: { create: jest.fn() },
    });

    it("should create a recipe type and return the repository result", async () => {
        const deps = makeDeps();
        const createdType = {
            id: 2,
            type_name: "Soup",
            description: "Warm bowls",
        };
        deps.recipeTypeRepository.create.mockResolvedValue(createdType);
        const useCase = new CreateRecipeType(deps.recipeTypeRepository);

        const result = await useCase.execute({
            type_name: "Soup",
            description: "Warm bowls",
        });

        expect(deps.recipeTypeRepository.create).toHaveBeenCalledWith({
            type_name: "Soup",
            description: "Warm bowls",
        });
        expect(result).toEqual(createdType);
    });

    it("should throw a 400 ValidationError when type_name is missing", async () => {
        const deps = makeDeps();
        const useCase = new CreateRecipeType(deps.recipeTypeRepository);

        const error = await catchError(
            useCase.execute({ description: "Warm bowls" } as {
                type_name: string;
                description: string;
            }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "type_name: Type name is required",
            400,
        );
        expect(deps.recipeTypeRepository.create).not.toHaveBeenCalled();
    });
});
