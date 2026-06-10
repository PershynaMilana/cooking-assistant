import { NotFoundError } from "../../../domain/errors/AppError";
import type {
    RecipeTypeInput,
    RecipeTypeRepository,
} from "../../../domain/repositories/RecipeTypeRepository";

export default class UpdateRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "update">,
    ) {}

    async execute(
        id: string | number,
        { type_name, description }: RecipeTypeInput,
    ): Promise<unknown> {
        const updated = await this.recipeTypeRepository.update(id, {
            type_name,
            description,
        });
        if (!updated) {
            throw new NotFoundError("Recipe type not found");
        }
        return updated;
    }
}
