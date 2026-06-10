import Recipe from "../../../domain/entities/Recipe";
import type { RecipeUpdateInput } from "../../../domain/entities/Recipe";
import { NotFoundError } from "../../../domain/errors/AppError";
import type { RecipeRepository } from "../../../domain/repositories/RecipeRepository";

export default class UpdateRecipe {
    constructor(private recipeRepository: Pick<RecipeRepository, "update">) {}

    async execute(
        id: string | number,
        input: RecipeUpdateInput,
    ): Promise<unknown> {
        const recipe = Recipe.forUpdate(input);
        const updated = await this.recipeRepository.update(id, recipe);
        if (!updated) {
            throw new NotFoundError("Recipe not found");
        }
        return updated;
    }
}
