import jwt from "jsonwebtoken";

import type { TokenService } from "../../application/ports/TokenService";
import { requireJwtSecret } from "../../config/env";

export default class JwtTokenService implements TokenService {
    generate(id: number): string {
        return jwt.sign({ id }, requireJwtSecret(), {
            expiresIn: "24h",
        });
    }
}
