export interface RecipeTypeInput {
    type_name: string;
    description?: string;
}

export interface RecipeTypeRepository {
    findAll(): Promise<unknown[]>;
    findById(id: string | number): Promise<unknown | null>;
    create(type: RecipeTypeInput): Promise<unknown>;
    update(id: string | number, type: RecipeTypeInput): Promise<unknown | null>;
    deleteById(id: string | number): Promise<unknown | null>;
}
