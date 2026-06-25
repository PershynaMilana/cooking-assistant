import { createSlice } from "@reduxjs/toolkit";

import { authApi } from "redux/services/authApi";

export type SessionStatus = "checking" | "authed" | "unauthed" | "error";

interface SessionState {
    status: SessionStatus;
}

const initialState: SessionState = { status: "checking" };

// session status is derived from the authApi endpoints: a getMe check drives
// checking/authed/error, logout (and the explicit loggedOut action) -> unauthed.
// "error" is reserved for failed checks (network/401); unauthed is explicit only
const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        loggedOut: (state) => {
            state.status = "unauthed";
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
                state.status = "checking";
            })
            .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state) => {
                state.status = "authed";
            })
            .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
                state.status = "error";
            })
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.status = "unauthed";
            });
    },
});

export const { loggedOut } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
