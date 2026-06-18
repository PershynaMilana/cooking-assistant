import { jwtDecode } from "jwt-decode";

export const setAuthToken = (token = "test-token") => {
    localStorage.setItem("authToken", token);
};

// configures the (already jest.mock'd) jwt-decode to decode to a given user id;
// the decoded object is a variable so it stays assignable without a cast
export const mockJwtUser = (id = 1) => {
    const decoded = { id };

    jest.mocked(jwtDecode).mockReturnValue(decoded);
};
