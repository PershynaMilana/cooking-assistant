import type { MenuRepository } from "../../../domain/repositories/MenuRepository";
import type { MenuFilters } from "./menu.types";

export default class SearchPersonMenus {
    constructor(
        private menuRepository: Pick<MenuRepository, "searchByPerson">,
    ) {}

    async execute(personId: number, filters: MenuFilters): Promise<unknown[]> {
        return this.menuRepository.searchByPerson(personId, filters);
    }
}
