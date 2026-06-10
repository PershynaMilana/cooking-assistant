import { NotFoundError, ValidationError } from "@domain/errors/AppError";
import type { MenuRepository } from "@domain/repositories/MenuRepository";

export default class DeleteMenu {
    constructor(private menuRepository: Pick<MenuRepository, "deleteById">) {}

    async execute(id: string | number | null): Promise<void> {
        if (!id) {
            throw new ValidationError("Menu ID is required");
        }

        const deleted = await this.menuRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Menu not found");
        }
    }
}
