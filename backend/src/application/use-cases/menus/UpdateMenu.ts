import Menu from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";
import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { updateMenuSchema } from "@application/validation/menu.schemas";
import { validate } from "@application/validation/validate";
import { assertRecipesExist } from "@application/validation/assertRecipesExist";
import type { UpdateMenuInput } from "./menu.types";

export default class UpdateMenu {
    constructor(
        private menuRepository: Pick<MenuRepository, "update">,
        private recipeRepository: Pick<RecipeRepository, "findExistingIds">,
    ) {}

    async execute(
        id: string | number | null,
        personId: number,
        input: UpdateMenuInput,
    ): Promise<void> {
        const menuId = validate(idSchema, id);
        const data = validate(updateMenuSchema, input);
        const menu = Menu.forUpdate(menuId, data);
        await assertRecipesExist(this.recipeRepository, data.recipeIds);
        const updated = await this.menuRepository.update(
            menuId,
            personId,
            menu,
            data.recipeIds,
        );
        if (!updated) {
            throw new NotFoundError("Menu not found");
        }
    }
}
