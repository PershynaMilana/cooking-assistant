import type {
    RecipeTypeInput,
    RecipeTypeRepository,
} from "@domain/repositories/RecipeTypeRepository";

export default class CreateRecipeType {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "create">,
    ) {}

    async execute({
        type_name,
        description,
    }: RecipeTypeInput): Promise<unknown> {
        return this.recipeTypeRepository.create({ type_name, description });
    }
}
