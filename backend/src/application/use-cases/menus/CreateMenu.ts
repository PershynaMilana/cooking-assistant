import Menu from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";
import { validate } from "@application/validation/validate";
import { createMenuSchema } from "@application/validation/menu.schemas";
import { assertRecipesExist } from "@application/validation/assertRecipesExist";
import type { CreateMenuInput } from "./menu.types";

export default class CreateMenu {
    constructor(
        private menuRepository: Pick<MenuRepository, "create">,
        private recipeRepository: Pick<RecipeRepository, "findExistingIds">,
    ) {}

    async execute(input: CreateMenuInput): Promise<unknown> {
        const data = validate(createMenuSchema, input);
        const menu = Menu.forCreation(data);
        await assertRecipesExist(this.recipeRepository, data.recipeIds);
        return this.menuRepository.create(menu, data.recipeIds);
    }
}
