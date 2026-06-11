import request from "supertest";

import { buildTestApp, authHeader } from "../helpers/testApp";

describe("user routes", () => {
    it("should return 401 without a token", async () => {
        const { app } = buildTestApp();

        const res = await request(app).get("/api/user");

        expect(res.status).toBe(401);
    });

    it("should register a user without a token", async () => {
        const { app, deps } = buildTestApp();
        const createdUser = {
            id: 7,
            name: "Bob",
            surname: "Cook",
            login: "bob",
        };
        deps.passwordHasher.hash.mockResolvedValue("hashed-secret");
        deps.userRepository.create.mockResolvedValue(createdUser);

        const res = await request(app).post("/api/register").send({
            name: "Bob",
            surname: "Cook",
            login: "bob",
            password: "secret",
        });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(createdUser);
        expect(deps.userRepository.create).toHaveBeenCalledWith({
            name: "Bob",
            surname: "Cook",
            login: "bob",
            password: "hashed-secret",
        });
    });

    it("should login a user without a token", async () => {
        const { app, deps } = buildTestApp();
        deps.userRepository.findByLogin.mockResolvedValue({
            id: 7,
            login: "bob",
            password: "hash",
        });
        deps.passwordHasher.compare.mockResolvedValue(true);
        deps.tokenService.generate.mockReturnValue("token-value");

        const res = await request(app).post("/api/login").send({
            login: "bob",
            password: "secret",
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: "token-value" });
    });

    it("should return users for an authenticated request", async () => {
        const { app, deps } = buildTestApp();
        const users = [{ id: 7, name: "Bob", surname: "Cook", login: "bob" }];
        deps.userRepository.findAll.mockResolvedValue(users);

        const res = await request(app)
            .get("/api/user")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(users);
    });

    it("should map a login domain error to the response status", async () => {
        const { app, deps } = buildTestApp();
        deps.userRepository.findByLogin.mockResolvedValue(null);

        const res = await request(app).post("/api/login").send({
            login: "missing",
            password: "secret",
        });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });
});
