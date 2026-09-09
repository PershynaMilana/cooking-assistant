import { toMetaDescription } from "utils/metaDescription";

const FALLBACK = "A soup recipe.";

describe("toMetaDescription", () => {
    it("should collapse the line breaks a textarea allows", () => {
        expect(toMetaDescription("Boil\n\n  the   water", FALLBACK)).toBe(
            "Boil the water",
        );
    });

    it("should fall back when the text is empty", () => {
        expect(toMetaDescription("   \n ", FALLBACK)).toBe(FALLBACK);
    });

    it("should cut a long text on a word boundary", () => {
        const result = toMetaDescription("word ".repeat(60), FALLBACK);

        expect(result.length).toBeLessThanOrEqual(160);
        expect(result.endsWith("word\u2026")).toBe(true);
    });

    it("should stay inside the budget when a long text has no word boundary", () => {
        const result = toMetaDescription("x".repeat(300), FALLBACK);

        expect(result.length).toBeLessThanOrEqual(160);
    });

    it("should keep a text that already fits", () => {
        expect(toMetaDescription("Short and sweet.", FALLBACK)).toBe(
            "Short and sweet.",
        );
    });
});
