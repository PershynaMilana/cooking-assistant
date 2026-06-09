const MenuCategoryRepository = require("../../../domain/repositories/MenuCategoryRepository");

class PgMenuCategoryRepository extends MenuCategoryRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async findAll() {
        const query = "SELECT * FROM menu_category ORDER BY category_name";
        const result = await this.pool.query(query);
        return result.rows;
    }
}

module.exports = PgMenuCategoryRepository;
