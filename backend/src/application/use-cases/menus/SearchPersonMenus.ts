import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import type { MenuFilters } from "./menu.types";

export default class SearchPersonMenus {
    constructor(
        private menuRepository: Pick<MenuRepository, "searchByPerson">,
    ) {}

    async execute(personId: number, filters: MenuFilters): Promise<unknown[]> {
        const validPersonId = validate(idSchema, personId);
        return this.menuRepository.searchByPerson(validPersonId, filters);
    }
}
