import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeTypeRepository } from "@domain/repositories/RecipeTypeRepository";

export default class GetRecipeTypeById {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "findById">,
    ) {}

    async execute(id: string | number): Promise<unknown> {
        const recipeTypeId = validate(idSchema, id);
        const type = await this.recipeTypeRepository.findById(recipeTypeId);
        if (!type) {
            throw new NotFoundError("Recipe type not found");
        }
        return type;
    }
}
