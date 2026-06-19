import { getDateRangeError } from "utils/dateRange";

const NOW = new Date("2024-06-15");

describe("getDateRangeError", () => {
    it("should return null for a valid past range", () => {
        expect(getDateRangeError("2024-01-01", "2024-02-01", NOW)).toBeNull();
    });

    it("should return null when both dates are empty", () => {
        expect(getDateRangeError("", "", NOW)).toBeNull();
    });

    it("should flag a start date later than the end date", () => {
        expect(getDateRangeError("2024-03-01", "2024-02-01", NOW)).toBe(
            "startAfterEnd",
        );
    });

    it("should flag a start date in the future", () => {
        expect(getDateRangeError("2024-12-01", "", NOW)).toBe("invalidRange");
    });

    it("should flag an end date in the future", () => {
        expect(getDateRangeError("", "2024-12-01", NOW)).toBe("invalidRange");
    });
});
