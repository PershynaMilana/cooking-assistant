import {
    createListenerMiddleware,
    isAnyOf,
    isRejectedWithValue,
} from "@reduxjs/toolkit";
import i18next from "i18next";

import { authApi } from "redux/services/authApi";
import type { AxiosBaseQueryError } from "redux/services/axiosBaseQuery";
import { menusApi } from "redux/services/menusApi";
import { recipesApi } from "redux/services/recipesApi";
import { userIngredientsApi } from "redux/services/userIngredientsApi";
import { addNotification } from "redux/slices/notificationsSlice";

export const FALLBACK_ERROR_MESSAGE = i18next.t(
    "notifications.somethingWentWrong",
);

const isQueryError = (payload: unknown): payload is AxiosBaseQueryError => {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    return "data" in payload && typeof payload.data === "string";
};

// pull the user-facing message out of a rejected RTK Query action payload
export const getErrorMessage = (payload: unknown): string =>
    isQueryError(payload)
        ? payload.data
        : i18next.t("notifications.somethingWentWrong");

// auth forms that already render their own inline error - excluded from the
// global toast so a failed login/register doesn't double-report
export const isSelfHandledRejection = isAnyOf(
    authApi.endpoints.login.matchRejected,
    authApi.endpoints.register.matchRejected,
);

export const notificationsListener = createListenerMiddleware();

// single global error channel: every failed request becomes an error toast,
// except the auth forms above that already show their own inline error
notificationsListener.startListening({
    matcher: isRejectedWithValue,
    effect: (action, listenerApi) => {
        if (isSelfHandledRejection(action)) {
            return;
        }

        listenerApi.dispatch(
            addNotification({
                type: "error",
                message: getErrorMessage(action.payload),
            }),
        );
    },
});

// mutations that navigate away on success (create/update forms) don't need a
// toast - the page transition is the success signal; only mutations that keep
// the user on the same page get a green confirmation toast
notificationsListener.startListening({
    matcher: recipesApi.endpoints.deleteRecipe.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.recipeDeleted"),
            }),
        );
    },
});

notificationsListener.startListening({
    matcher: menusApi.endpoints.deleteMenu.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.menuDeleted"),
            }),
        );
    },
});

notificationsListener.startListening({
    matcher: userIngredientsApi.endpoints.deleteUserIngredient.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.ingredientDeleted"),
            }),
        );
    },
});

notificationsListener.startListening({
    matcher: userIngredientsApi.endpoints.saveUserIngredient.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.ingredientsSaved"),
            }),
        );
    },
});

notificationsListener.startListening({
    matcher: userIngredientsApi.endpoints.updateQuantities.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.quantitiesUpdated"),
            }),
        );
    },
});

notificationsListener.startListening({
    matcher: userIngredientsApi.endpoints.updatePurchase.matchFulfilled,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(
            addNotification({
                type: "success",
                message: i18next.t("notifications.purchaseSaved"),
            }),
        );
    },
});
