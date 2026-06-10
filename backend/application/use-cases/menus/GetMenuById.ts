import {
    NotFoundError,
    ValidationError,
} from "../../../domain/errors/AppError";
import type { MenuRepository } from "../../../domain/repositories/MenuRepository";

export default class GetMenuById {
    constructor(
        private menuRepository: Pick<MenuRepository, "findByIdWithRecipes">,
    ) {}

    async execute(id: string | number | null): Promise<unknown> {
        if (!id) {
            throw new ValidationError("Menu ID is required");
        }

        const menu = await this.menuRepository.findByIdWithRecipes(id);
        if (!menu) {
            throw new NotFoundError("Menu not found");
        }
        return menu;
    }
}
