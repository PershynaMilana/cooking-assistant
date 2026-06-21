import jwt from "jsonwebtoken";

import { requireJwtSecret } from "config/env";

import type { TokenService } from "application/ports/TokenService";

export default class JwtTokenService implements TokenService {
    generate(id: number): string {
        return jwt.sign({ id }, requireJwtSecret(), {
            expiresIn: "24h",
            algorithm: "HS256",
        });
    }
}
