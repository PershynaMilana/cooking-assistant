import { jwtDecode } from "jwt-decode";

import { getCurrentUserId } from "utils/getCurrentUserId";

import { mockJwtUser, setAuthToken } from "test/auth";

jest.mock("jwt-decode");

describe("getCurrentUserId", () => {
    it("should return the decoded user id when a token is present", () => {
        setAuthToken();
        mockJwtUser(7);

        expect(getCurrentUserId()).toBe(7);
    });

    it("should return null when no auth token is stored", () => {
        expect(getCurrentUserId()).toBeNull();
    });

    it("should propagate the decode error when the token is invalid", () => {
        setAuthToken("bad");
        jest.mocked(jwtDecode).mockImplementation(() => {
            throw new Error("invalid token");
        });

        expect(() => getCurrentUserId()).toThrow();
    });
});
