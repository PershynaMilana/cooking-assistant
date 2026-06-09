const UserRepository = require("../../../domain/repositories/UserRepository");

class PgUserRepository extends UserRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async findByLogin(login) {
        const user = await this.pool.query(
            `SELECT * FROM person WHERE login = $1`,
            [login],
        );
        return user.rows[0] || null;
    }

    async create({ name, surname, login, password }) {
        const newUser = await this.pool.query(
            `INSERT INTO person (name, surname, login, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, login`,
            [name, surname, login, password],
        );
        return newUser.rows[0];
    }

    async findAll() {
        const users = await this.pool.query(
            `SELECT id, name, surname, login FROM person`,
        );
        return users.rows;
    }
}

module.exports = PgUserRepository;
