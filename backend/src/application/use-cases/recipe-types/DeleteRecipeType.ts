import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeTypeRepository } from "@domain/repositories/RecipeTypeRepository";

export default class DeleteRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "deleteById">,
    ) {}

    async execute(id: string | number): Promise<void> {
        const recipeTypeId = validate(idSchema, id);
        const deleted =
            await this.recipeTypeRepository.deleteById(recipeTypeId);
        if (!deleted) {
            throw new NotFoundError("Recipe type not found");
        }
    }
}
