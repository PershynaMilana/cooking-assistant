"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

// false during the server render and the first client render, true from the next one on: the
// gate for anything the server cannot know (storage, matchMedia) without a hydration mismatch
export const useIsHydrated = (): boolean =>
    useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
