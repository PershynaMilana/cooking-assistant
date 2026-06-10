import type { Recipe } from "../entities/Recipe";

export interface RecipeRepository {
    create(recipe: Recipe): Promise<unknown>;
    findAllWithIngredients(): Promise<unknown[]>;
    findByIdWithIngredients(id: string | number): Promise<unknown | null>;
    update(id: string | number, data: Recipe): Promise<unknown | null>;
    deleteById(id: string | number): Promise<unknown | null>;
    search(filters: unknown): Promise<unknown[]>;
    searchByPerson(personId: number, filters: unknown): Promise<unknown[]>;
    getStats(): Promise<unknown>;
    findAllIngredients(): Promise<unknown[]>;
}
