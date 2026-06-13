import jwt from "jsonwebtoken";

import JwtTokenService from "@infrastructure/security/JwtTokenService";

describe("JwtTokenService", () => {
    it("should sign a token with the user id that verifies under HS256", () => {
        const service = new JwtTokenService();

        const token = service.generate(7);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string,
            {
                algorithms: ["HS256"],
            },
        );

        expect(decoded).toMatchObject({ id: 7 });
    });
});
