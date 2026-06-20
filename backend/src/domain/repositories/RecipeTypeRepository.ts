export interface RecipeTypeRepository {
    findAll(): Promise<unknown[]>;
}
