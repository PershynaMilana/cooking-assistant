import axios from "axios";

interface ApiErrorBody {
    error?: string;
}

export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        const serverMessage = error.response?.data.error;

        if (serverMessage) {
            return serverMessage;
        }

        return error.message;
    }

    return "Unknown error";
}
