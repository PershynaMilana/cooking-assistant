import { NotFoundError } from "../../../domain/errors/AppError";
import type { RecipeTypeRepository } from "../../../domain/repositories/RecipeTypeRepository";

export default class GetRecipeTypeById {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "findById">,
    ) {}

    async execute(id: string | number): Promise<unknown> {
        const type = await this.recipeTypeRepository.findById(id);
        if (!type) {
            throw new NotFoundError("Recipe type not found");
        }
        return type;
    }
}
