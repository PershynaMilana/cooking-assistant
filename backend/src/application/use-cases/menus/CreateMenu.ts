import Menu from "domain/entities/Menu";
import type { MenuRepository } from "domain/repositories/MenuRepository";
import type { RecipeRepository } from "domain/repositories/RecipeRepository";

import { assertRecipesExist } from "application/validation/assertRecipesExist";
import { createMenuSchema } from "application/validation/menu.schemas";
import { validate } from "application/validation/validate";

export default class CreateMenu {
    constructor(
        private menuRepository: Pick<MenuRepository, "create">,
        private recipeRepository: Pick<RecipeRepository, "findExistingIds">,
    ) {}

    async execute(input: unknown): Promise<unknown> {
        const data = validate(createMenuSchema, input);
        const menu = Menu.forCreation(data);

        await assertRecipesExist(this.recipeRepository, data.recipeIds);

        return this.menuRepository.create(menu, data.recipeIds);
    }
}
