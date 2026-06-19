export interface RecipeTypeSummary {
    id: number;
    type_name: string;
    description: string;
}

export interface RecipeTypeFormData {
    type_name: string;
    description: string;
}

export interface RecipeTypeErrors {
    type_name?: string;
    description?: string;
}

export interface RecipeTypesQuery {
    ids?: string;
}
