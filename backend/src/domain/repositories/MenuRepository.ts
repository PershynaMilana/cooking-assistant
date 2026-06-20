import type { Menu } from "@domain/entities/Menu";

export interface MenuRepository {
    findAll(filters: unknown): Promise<unknown[]>;
    create(menu: Menu, recipeIds: number[]): Promise<unknown>;
    findByIdWithRecipes(
        id: string | number,
        personId: number,
    ): Promise<unknown | null>;
    update(
        id: string | number,
        personId: number,
        menu: Menu,
        recipeIds: number[],
    ): Promise<boolean>;
    deleteById(id: string | number, personId: number): Promise<unknown | null>;
    searchByPerson(personId: number, filters: unknown): Promise<unknown[]>;
}
