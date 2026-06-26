import type { RootState } from "redux/store";

export const selectRecipeFilters = (state: RootState) => state.filters.recipe;
export const selectMenuFilters = (state: RootState) => state.filters.menu;
