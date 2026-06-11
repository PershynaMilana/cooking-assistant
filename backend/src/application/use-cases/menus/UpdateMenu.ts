import Menu from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import { idSchema } from "@application/validation/common.schemas";
import { updateMenuSchema } from "@application/validation/menu.schemas";
import { validate } from "@application/validation/validate";
import type { UpdateMenuInput } from "./menu.types";

export default class UpdateMenu {
    constructor(private menuRepository: Pick<MenuRepository, "update">) {}

    async execute(
        id: string | number | null,
        input: UpdateMenuInput,
    ): Promise<void> {
        const menuId = validate(idSchema, id);
        const data = validate(updateMenuSchema, input);
        const menu = Menu.forUpdate(menuId, data);
        await this.menuRepository.update(menuId, menu, data.recipeIds);
    }
}
