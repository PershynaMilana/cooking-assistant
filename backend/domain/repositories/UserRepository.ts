export interface UserRecord {
    id: number;
    password: string;
    [key: string]: unknown;
}

export interface NewUser {
    name: string;
    surname: string;
    login: string;
    password: string;
}

export interface UserRepository {
    findByLogin(login: string): Promise<UserRecord | null>;
    create(user: NewUser): Promise<unknown>;
    findAll(): Promise<unknown[]>;
}
