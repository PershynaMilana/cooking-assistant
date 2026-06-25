import {
    createListenerMiddleware,
    isRejectedWithValue,
} from "@reduxjs/toolkit";

import type { AxiosBaseQueryError } from "redux/services/axiosBaseQuery";
import { addNotification } from "redux/slices/notificationsSlice";

export const FALLBACK_ERROR_MESSAGE = "Something went wrong";

const isQueryError = (payload: unknown): payload is AxiosBaseQueryError => {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    return "data" in payload && typeof payload.data === "string";
};

// pull the user-facing message out of a rejected RTK Query action payload
export const getErrorMessage = (payload: unknown): string =>
    isQueryError(payload) ? payload.data : FALLBACK_ERROR_MESSAGE;

export const notificationsListener = createListenerMiddleware();

// single global error channel: every failed request becomes an error toast
notificationsListener.startListening({
    matcher: isRejectedWithValue,
    effect: (action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "error",
                message: getErrorMessage(action.payload),
            }),
        );
    },
});
