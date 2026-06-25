import type { RootState } from "redux/store";

export const selectNotifications = (state: RootState) =>
    state.notifications.items;
