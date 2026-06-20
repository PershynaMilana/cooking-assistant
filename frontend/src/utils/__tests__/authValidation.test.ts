import {
    isValidLogin,
    isValidNamePart,
    isValidPassword,
} from "utils/authValidation";

describe("isValidNamePart", () => {
    it("should accept a capitalised name", () => {
        expect(isValidNamePart("Test")).toBe(true);
    });

    it("should reject a lowercase first letter", () => {
        expect(isValidNamePart("test")).toBe(false);
    });

    it("should reject a single letter", () => {
        expect(isValidNamePart("T")).toBe(false);
    });

    it("should reject a value containing digits", () => {
        expect(isValidNamePart("Test1")).toBe(false);
    });

    it("should reject an empty value", () => {
        expect(isValidNamePart("")).toBe(false);
    });
});

describe("isValidLogin", () => {
    it("should accept two or more characters", () => {
        expect(isValidLogin("ab")).toBe(true);
    });

    it("should reject a single character", () => {
        expect(isValidLogin("a")).toBe(false);
    });
});

describe("isValidPassword", () => {
    it("should accept six or more characters", () => {
        expect(isValidPassword("secret")).toBe(true);
    });

    it("should reject fewer than six characters", () => {
        expect(isValidPassword("five5")).toBe(false);
    });
});
