import { ValidationError } from "../../../domain/errors/AppError";
import type {
    PantryIngredientInput,
    PantryRepository,
} from "../../../domain/repositories/PantryRepository";

export default class UpdateIngredientQuantities {
    constructor(
        private pantryRepository: Pick<PantryRepository, "updateQuantities">,
    ) {}

    async execute(
        userId: string | number,
        updatedIngredients: unknown,
    ): Promise<void> {
        if (!Array.isArray(updatedIngredients)) {
            throw new ValidationError("Incorrect data format");
        }

        await this.pantryRepository.updateQuantities(
            userId,
            updatedIngredients as PantryIngredientInput[],
        );
    }
}
