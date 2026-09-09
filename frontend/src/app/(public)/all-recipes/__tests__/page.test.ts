import { generateMetadata } from "app/(public)/all-recipes/page";

describe("all recipes page", () => {
    it("should point every filtered view at the one canonical list", async () => {
        const metadata = await generateMetadata();

        expect(metadata.title).toBe("All recipes");
        expect(metadata.alternates?.canonical).toBe("/all-recipes");
        expect(metadata.description).not.toHaveLength(0);
    });
});
