import type { Recipe } from "@domain/entities/Recipe";

export interface RecipeRepository {
    create(recipe: Recipe): Promise<unknown>;
    findAllWithIngredients(): Promise<unknown[]>;
    findByIdWithIngredients(
        id: string | number,
        currentUserId: number,
    ): Promise<unknown | null>;
    update(
        id: string | number,
        personId: number,
        data: Recipe,
    ): Promise<unknown | null>;
    deleteById(id: string | number, personId: number): Promise<unknown | null>;
    search(filters: unknown): Promise<unknown[]>;
    searchByPerson(personId: number, filters: unknown): Promise<unknown[]>;
    findExistingIds(ids: number[]): Promise<number[]>;
    getStats(): Promise<unknown>;
    findAllIngredients(): Promise<unknown[]>;
}
