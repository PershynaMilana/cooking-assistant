import { getServerTranslation } from "i18n/server";

const APP_NAME = "Cooking Assistant";

describe("getServerTranslation", () => {
    it("should translate keys from the default namespace", async () => {
        const t = await getServerTranslation();

        expect(t("appName")).toBe(APP_NAME);
    });

    it("should translate keys from an explicit namespace", async () => {
        const t = await getServerTranslation("en", "auth");

        expect(t("loginPage.heading")).toBe("Welcome back");
    });

    it("should fall back to the default language for an unknown one", async () => {
        const t = await getServerTranslation("qq");

        expect(t("appName")).toBe(APP_NAME);
    });

    it("should not share state between instances", async () => {
        const common = await getServerTranslation();
        const auth = await getServerTranslation("en", "auth");

        expect(common("appName")).toBe(APP_NAME);
        expect(auth("loginPage.heading")).toBe("Welcome back");
    });
});
