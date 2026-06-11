import type {
    RecipeTypeInput,
    RecipeTypeRepository,
} from "@domain/repositories/RecipeTypeRepository";
import { validate } from "@application/validation/validate";
import { recipeTypeSchema } from "@application/validation/recipeType.schemas";

export default class CreateRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "create">,
    ) {}

    async execute(input: RecipeTypeInput): Promise<unknown> {
        const data = validate(recipeTypeSchema, input);
        return this.recipeTypeRepository.create(data);
    }
}
