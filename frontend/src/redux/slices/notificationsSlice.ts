import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, nanoid } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
}

// what a caller provides; the id is generated in the action `prepare` step
export interface NotificationInput {
    type: NotificationType;
    message: string;
}

interface NotificationsState {
    items: Notification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: {
            reducer: (state, action: PayloadAction<Notification>) => {
                state.items.push(action.payload);
            },
            prepare: (input: NotificationInput) => ({
                payload: { id: nanoid(), ...input },
            }),
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            );
        },
    },
});

export const { addNotification, removeNotification } =
    notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
