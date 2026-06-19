import { isExpired } from "utils/ingredientExpirationUtils";

const PAST_DATE = "2020-01-01";

describe("isExpired", () => {
    it("should return true for a past purchase that has expired", () => {
        expect(isExpired(PAST_DATE, 5)).toBe(true);
    });

    it("should return false when purchase date is missing", () => {
        expect(isExpired(undefined, 10)).toBe(false);
    });

    it("should return false when days_to_expire is missing", () => {
        expect(isExpired(PAST_DATE, null)).toBe(false);
    });

    it("should return false when both params are missing", () => {
        expect(isExpired(undefined, null)).toBe(false);
    });

    it("should return true for an ingredient with 0 days to expire past its purchase date", () => {
        expect(isExpired(PAST_DATE, 0)).toBe(true);
    });

    it("should return false for an item that has not yet expired", () => {
        const farFuture = new Date();

        farFuture.setFullYear(farFuture.getFullYear() + 5);

        expect(isExpired(farFuture.toISOString(), 1)).toBe(false);
    });
});
