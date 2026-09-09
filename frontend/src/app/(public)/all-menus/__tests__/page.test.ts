import { generateMetadata } from "app/(public)/all-menus/page";

describe("all menus page", () => {
    it("should point every filtered view at the one canonical list", async () => {
        const metadata = await generateMetadata();

        expect(metadata.title).toBe("All menus");
        expect(metadata.alternates?.canonical).toBe("/all-menus");
        expect(metadata.description).not.toHaveLength(0);
    });
});
