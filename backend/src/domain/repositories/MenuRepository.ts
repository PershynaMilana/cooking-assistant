import type { Menu } from "@domain/entities/Menu";

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
