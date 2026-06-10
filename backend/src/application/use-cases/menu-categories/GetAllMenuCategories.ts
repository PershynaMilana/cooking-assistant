import type { MenuCategoryRepository } from "@domain/repositories/MenuCategoryRepository";

export default class GetAllMenuCategories {
    constructor(
        private menuCategoryRepository: Pick<MenuCategoryRepository, "findAll">,
    ) {}

    async execute(): Promise<unknown[]> {
        return this.menuCategoryRepository.findAll();
    }
}
