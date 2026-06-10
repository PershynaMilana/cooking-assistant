export interface MenuCategoryRepository {
    findAll(): Promise<unknown[]>;
}
