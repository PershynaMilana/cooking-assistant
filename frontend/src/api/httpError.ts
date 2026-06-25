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

    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown error";
}

// HTTP status for the axios baseQuery; non-axios errors have no status
export function getApiErrorStatus(error: unknown): number | undefined {
    if (axios.isAxiosError(error)) {
        return error.response?.status;
    }

    return undefined;
}
