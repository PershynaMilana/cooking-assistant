import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "redux/store";

// typed wrappers - components use these instead of the bare react-redux hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
