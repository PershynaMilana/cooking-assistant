"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

import { useNavigationBlocker } from "components/layout/NavigationBlocker";

// intercepts in-app navigation while a form has unsaved edits. Dirtiness is read through a ref at
// navigation time, so a just-saved form can disarm itself synchronously before navigating; the
// boolean drives the back-button guard, which must be armed the moment there is something to lose
export const useUnsavedChangesBlocker = (
    isDirty: boolean,
    isDirtyRef: RefObject<boolean>,
) => {
    const { register, arm, isBlocked, proceed, reset } = useNavigationBlocker();

    useEffect(() => register(isDirtyRef), [register, isDirtyRef]);

    useEffect(() => {
        arm(isDirty);
    }, [arm, isDirty]);

    return { isBlocked, proceed, reset };
};
