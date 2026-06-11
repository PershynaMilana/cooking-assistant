import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { recipeTypeSchema } from "@application/validation/recipeType.schemas";
import { validate } from "@application/validation/validate";
import type {
    RecipeTypeInput,
    RecipeTypeRepository,
} from "@domain/repositories/RecipeTypeRepository";

export default class UpdateRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "update">,
    ) {}

    async execute(
        id: string | number,
        input: RecipeTypeInput,
    ): Promise<unknown> {
        const recipeTypeId = validate(idSchema, id);
        const data = validate(recipeTypeSchema, input);
        const updated = await this.recipeTypeRepository.update(
            recipeTypeId,
            data,
        );
        if (!updated) {
            throw new NotFoundError("Recipe type not found");
        }
        return updated;
    }
}
