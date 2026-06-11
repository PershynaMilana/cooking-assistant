import Menu from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import { validate } from "@application/validation/validate";
import { createMenuSchema } from "@application/validation/menu.schemas";
import type { CreateMenuInput } from "./menu.types";

export default class CreateMenu {
    constructor(private menuRepository: Pick<MenuRepository, "create">) {}

    async execute(input: CreateMenuInput): Promise<unknown> {
        const data = validate(createMenuSchema, input);
        const menu = Menu.forCreation(data);
        return this.menuRepository.create(menu, data.recipeIds);
    }
}
