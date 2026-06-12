import { idSchema } from "@application/validation/common.schemas";
import { menuFiltersSchema } from "@application/validation/menu.schemas";
import { validate } from "@application/validation/validate";
import type { MenuRepository } from "@domain/repositories/MenuRepository";

export default class SearchPersonMenus {
    constructor(
        private menuRepository: Pick<MenuRepository, "searchByPerson">,
    ) {}

    async execute(personId: number, filters: unknown): Promise<unknown[]> {
        const validPersonId = validate(idSchema, personId);
        const validFilters = validate(menuFiltersSchema, filters);
        return this.menuRepository.searchByPerson(validPersonId, validFilters);
    }
}
