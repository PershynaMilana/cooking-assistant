import { ValidationError } from "../../../domain/errors/AppError";
import type {
    PantryIngredientInput,
    PantryRepository,
} from "../../../domain/repositories/PantryRepository";

export default class AddUserIngredients {
    constructor(
        private pantryRepository: Pick<PantryRepository, "addIngredients">,
    ) {}

    async execute(
        userId: string | number,
        ingredients: unknown,
    ): Promise<void> {
        if (!Array.isArray(ingredients)) {
            throw new ValidationError("Incorrect data format");
        }

        await this.pantryRepository.addIngredients(
            userId,
            ingredients as PantryIngredientInput[],
        );
    }
}
