import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { MenuRepository } from "@domain/repositories/MenuRepository";

export default class DeleteMenu {
    constructor(private menuRepository: Pick<MenuRepository, "deleteById">) {}

    async execute(id: string | number | null, personId: number): Promise<void> {
        const menuId = validate(idSchema, id);
        const validPersonId = validate(idSchema, personId);
        const deleted = await this.menuRepository.deleteById(
            menuId,
            validPersonId,
        );
        if (!deleted) {
            throw new NotFoundError("Menu not found");
        }
    }
}
