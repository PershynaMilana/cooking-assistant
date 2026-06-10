import Menu from "../../../domain/entities/Menu";
import type { MenuRepository } from "../../../domain/repositories/MenuRepository";
import type { UpdateMenuInput } from "./menu.types";

export default class UpdateMenu {
    constructor(private menuRepository: Pick<MenuRepository, "update">) {}

    async execute(
        id: string | number | null,
        input: UpdateMenuInput,
    ): Promise<void> {
        const menu = Menu.forUpdate(id, input);
        await this.menuRepository.update(
            id as string | number,
            menu,
            input.recipeIds,
        );
    }
}
