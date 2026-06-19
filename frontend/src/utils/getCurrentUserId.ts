import { jwtDecode } from "jwt-decode";

import { AUTH_TOKEN_KEY } from "constants/storage";

interface DecodedToken {
    id: number;
}

// reads the current user's id from the JWT in localStorage; returns null when no
// token is stored and throws (like jwtDecode) when the token cannot be decoded
export const getCurrentUserId = (): number | null => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
        return null;
    }

    return jwtDecode<DecodedToken>(token).id;
};

// silently returns null on both missing and malformed tokens — use when
// an auth failure should degrade gracefully rather than propagate an exception
export const getUserIdSafe = (): number | null => {
    try {
        return getCurrentUserId();
    } catch (error) {
        console.error("Error decoding token:", error);

        return null;
    }
};
