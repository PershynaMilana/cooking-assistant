import robots from "app/robots";

describe("robots", () => {
    it("should point crawlers at the sitemap", () => {
        expect(robots().sitemap).toBe("http://localhost:8080/sitemap.xml");
    });

    it("should keep crawlers out of the private area", () => {
        const { disallow } = robots().rules as { disallow: string[] };

        expect(disallow).toContain("/profile");
        expect(disallow).toContain("/change-recipe/");
    });

    it("should leave the public pages open", () => {
        const rules = robots().rules as { allow: string; disallow: string[] };

        expect(rules.allow).toBe("/");
        expect(rules.disallow).not.toContain("/all-recipes");
        expect(rules.disallow).not.toContain("/recipe/");
    });
});
