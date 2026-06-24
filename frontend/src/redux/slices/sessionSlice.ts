import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getMe } from "api/authApi";

export type SessionStatus = "checking" | "authed" | "unauthed" | "error";

interface SessionState {
    status: SessionStatus;
}

const initialState: SessionState = { status: "checking" };

// one server round-trip to confirm the auth cookie is still valid
export const checkSession = createAsyncThunk("session/check", () => getMe());

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
            .addCase(checkSession.pending, (state) => {
                state.status = "checking";
            })
            .addCase(checkSession.fulfilled, (state) => {
                state.status = "authed";
            })
            .addCase(checkSession.rejected, (state) => {
                state.status = "error";
            });
    },
});

export const { loggedOut } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
