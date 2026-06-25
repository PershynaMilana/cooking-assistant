import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, nanoid } from "@reduxjs/toolkit";

// global modal manager: the active modal is a discriminated union keyed by
// `type`, so ModalRoot renders the matching modal and reads a typed payload.
// Modal types live here as a single source of truth, with no magic strings.
export const MODAL_TYPE = {
    ingredientHistory: "ingredientHistory",
} as const;

export interface IngredientHistoryModalInput {
    type: typeof MODAL_TYPE.ingredientHistory;
    ingredientId: number;
    ingredientName: string;
}

export interface IngredientHistoryModal extends IngredientHistoryModalInput {
    id: string;
}

export type ModalInput = IngredientHistoryModalInput;
export type ActiveModal = IngredientHistoryModal;

interface UiState {
    modal: ActiveModal | null;
}

const initialState: UiState = { modal: null };

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openModal: {
            reducer: (state, action: PayloadAction<ActiveModal>) => {
                state.modal = action.payload;
            },
            prepare: (modal: ModalInput) => ({
                payload: { id: nanoid(), ...modal },
            }),
        },
        closeModal: (state, action: PayloadAction<string>) => {
            if (state.modal?.id === action.payload) {
                state.modal = null;
            }
        },
    },
});

export const { openModal, closeModal } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
