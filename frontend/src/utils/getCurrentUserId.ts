import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: number;
}

// reads the current user's id from the JWT in localStorage; returns null when no
// token is stored and throws (like jwtDecode) when the token cannot be decoded
export const getCurrentUserId = (): number | null => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return null;
    }

    return jwtDecode<DecodedToken>(token).id;
};
