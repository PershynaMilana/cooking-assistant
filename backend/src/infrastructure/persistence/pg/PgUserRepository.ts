import type { Pool } from "pg";

import { AppError } from "@domain/errors/AppError";
import type {
    NewUser,
    UserRecord,
    UserRepository,
} from "@domain/repositories/UserRepository";

function isUniqueViolation(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: unknown }).code === "23505"
    );
}

export default class PgUserRepository implements UserRepository {
    constructor(private pool: Pool) {}

    async findByLogin(login: string): Promise<UserRecord | null> {
        const user = await this.pool.query(
            `SELECT * FROM person WHERE login = $1`,
            [login],
        );
        return user.rows[0] || null;
    }

    async create({
        name,
        surname,
        login,
        password,
    }: NewUser): Promise<unknown> {
        try {
            const newUser = await this.pool.query(
                `INSERT INTO person (name, surname, login, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, login`,
                [name, surname, login, password],
            );
            return newUser.rows[0];
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new AppError("Login already taken", 409);
            }
            throw error;
        }
    }

    async findAll(): Promise<unknown[]> {
        const users = await this.pool.query(
            `SELECT id, name, surname, login FROM person`,
        );
        return users.rows;
    }
}
