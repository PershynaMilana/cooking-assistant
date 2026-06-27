import i18next from "i18next";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// the axios base query maps every failure to { status, data: message }, so a
// failed RTK Query result carries a ready user-facing string in `data`
export const getQueryErrorMessage = (error: unknown): string => {
    if (isObject(error) && typeof error.data === "string") {
        return error.data;
    }

    return i18next.t("notifications.somethingWentWrong");
};

// the HTTP status the axios base query attached to a failed RTK Query result
export const getQueryErrorStatus = (error: unknown): number | null => {
    if (isObject(error) && typeof error.status === "number") {
        return error.status;
    }

    return null;
};

// the server Retry-After cool-down (seconds) the axios base query attached, if any
export const getQueryErrorRetryAfter = (error: unknown): number | null => {
    if (isObject(error) && typeof error.retryAfter === "number") {
        return error.retryAfter;
    }

    return null;
};
