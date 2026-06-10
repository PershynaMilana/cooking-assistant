import Menu from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import type { CreateMenuInput } from "./menu.types";

export default class CreateMenu {
    constructor(private menuRepository: Pick<MenuRepository, "create">) {}

    async execute(input: CreateMenuInput): Promise<unknown> {
        const menu = Menu.forCreation(input);
        return this.menuRepository.create(menu, input.recipeIds);
    }
}
