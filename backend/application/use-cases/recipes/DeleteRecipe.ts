import { NotFoundError } from "../../../domain/errors/AppError";
import type { RecipeRepository } from "../../../domain/repositories/RecipeRepository";

export default class DeleteRecipe {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "deleteById">,
    ) {}

    async execute(id: string | number): Promise<void> {
        const deleted = await this.recipeRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Recipe not found");
        }
    }
}
