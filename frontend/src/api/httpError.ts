import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.error || error.message;
    }
    return "Unknown error";
}
