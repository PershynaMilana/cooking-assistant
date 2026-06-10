import type { Menu } from "../entities/Menu";

export interface MenuRepository {
    findAll(filters: unknown): Promise<unknown[]>;
    create(menu: Menu, recipeIds: number[]): Promise<unknown>;
    findByIdWithRecipes(id: string | number): Promise<unknown | null>;
    update(
        id: string | number,
        menu: Menu,
        recipeIds: number[],
    ): Promise<unknown>;
    deleteById(id: string | number): Promise<unknown | null>;
    searchByPerson(personId: number, filters: unknown): Promise<unknown[]>;
}
