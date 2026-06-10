import type { MenuRepository } from "../../../domain/repositories/MenuRepository";
import type { MenuFilters } from "./menu.types";

export default class GetAllMenus {
    constructor(private menuRepository: Pick<MenuRepository, "findAll">) {}

    async execute(filters: MenuFilters): Promise<unknown[]> {
        return this.menuRepository.findAll(filters);
    }
}
