import { ValidationError } from "@domain/errors/AppError";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export async function assertRecipesExist(
    recipeRepository: Pick<RecipeRepository, "findExistingIds">,
    recipeIds: number[],
): Promise<void> {
    if (recipeIds.length === 0) return;

    const existingIds = await recipeRepository.findExistingIds(recipeIds);
    const existingSet = new Set(existingIds);

    if (!recipeIds.every((id) => existingSet.has(id))) {
        throw new ValidationError("One or more recipes do not exist");
    }
}
