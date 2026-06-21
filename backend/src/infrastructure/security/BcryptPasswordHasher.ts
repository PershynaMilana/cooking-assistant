import bcrypt from "bcryptjs";

import type { PasswordHasher } from "application/ports/PasswordHasher";

export default class BcryptPasswordHasher implements PasswordHasher {
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, 10);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
