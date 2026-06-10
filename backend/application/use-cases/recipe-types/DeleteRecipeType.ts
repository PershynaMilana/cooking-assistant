import { NotFoundError } from "../../../domain/errors/AppError";
import type { RecipeTypeRepository } from "../../../domain/repositories/RecipeTypeRepository";

export default class DeleteRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "deleteById">,
    ) {}

    async execute(id: string | number): Promise<void> {
        const deleted = await this.recipeTypeRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Recipe type not found");
        }
    }
}
