import type { RootState } from "redux/store";

export const selectActiveModal = (state: RootState) => state.ui.modal;
