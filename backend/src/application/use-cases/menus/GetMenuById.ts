import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { MenuRepository } from "@domain/repositories/MenuRepository";

export default class GetMenuById {
    constructor(
        private menuRepository: Pick<MenuRepository, "findByIdWithRecipes">,
    ) {}

    async execute(id: string | number | null): Promise<unknown> {
        const menuId = validate(idSchema, id);
        const menu = await this.menuRepository.findByIdWithRecipes(menuId);
        if (!menu) {
            throw new NotFoundError("Menu not found");
        }
        return menu;
    }
}
