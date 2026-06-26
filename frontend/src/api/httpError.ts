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

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// Retry-After cool-down in seconds (e.g. a 429), parsed from the response header;
// null when absent, non-numeric, or not an axios error. The header bag is read
// defensively because a malformed/partial error response may lack headers
export function getApiErrorRetryAfter(error: unknown): number | null {
    if (!axios.isAxiosError(error)) {
        return null;
    }

    const headers: unknown = error.response?.headers;
    const retryAfter = isRecord(headers) ? headers["retry-after"] : null;
    const seconds = Number(retryAfter);

    return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}
