import Recipe from "@domain/entities/Recipe";
import type { RecipeUpdateInput } from "@domain/entities/Recipe";
import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import { updateRecipeSchema } from "@application/validation/recipe.schemas";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class UpdateRecipe {
    constructor(private recipeRepository: Pick<RecipeRepository, "update">) {}

    async execute(
        id: string | number,
        personId: number,
        input: RecipeUpdateInput,
    ): Promise<unknown> {
        const recipeId = validate(idSchema, id);
        const validPersonId = validate(idSchema, personId);
        const data = validate(updateRecipeSchema, input);
        const recipe = Recipe.forUpdate(data);
        const updated = await this.recipeRepository.update(
            recipeId,
            validPersonId,
            recipe,
        );
        if (!updated) {
            throw new NotFoundError("Recipe not found");
        }
        return updated;
    }
}
