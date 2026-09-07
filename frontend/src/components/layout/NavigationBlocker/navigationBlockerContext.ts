"use client";

import type { RefObject } from "react";
import { createContext, useContext } from "react";

export interface NavigationBlockerValue {
    // a guarded form registers its dirtiness here; the returned callback unregisters it
    register: (isDirtyRef: RefObject<boolean>) => () => void;
    // arms the back-button guard - only while there is something to lose
    arm: (isArmed: boolean) => void;
    hasUnsavedChanges: () => boolean;
    defer: (perform: () => void) => void;
    isBlocked: boolean;
    proceed: () => void;
    reset: () => void;
}

export const NavigationBlockerContext =
    createContext<NavigationBlockerValue | null>(null);

export const useNavigationBlocker = (): NavigationBlockerValue => {
    const value = useContext(NavigationBlockerContext);

    if (!value) {
        throw new Error(
            "useNavigationBlocker must be used inside NavigationBlockerProvider",
        );
    }

    return value;
};
