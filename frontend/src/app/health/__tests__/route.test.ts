import { GET } from "app/health/route";

describe("health route", () => {
    it("should answer ok", async () => {
        const response = GET();

        expect(response.status).toBe(200);
        await expect(response.text()).resolves.toBe("ok");
    });
});
