import { configureStore } from "@reduxjs/toolkit";

import { sessionReducer } from "store/slices/sessionSlice";

export const store = configureStore({
    reducer: {
        session: sessionReducer,
    },
});

// types are inferred from the store itself, so they never drift from the real shape
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
