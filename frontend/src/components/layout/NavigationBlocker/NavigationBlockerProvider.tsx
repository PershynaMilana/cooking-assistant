"use client";

import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { NavigationBlockerValue } from "./navigationBlockerContext";
import { NavigationBlockerContext } from "./navigationBlockerContext";

type DirtyRef = RefObject<boolean>;

// marks the duplicate history entry the back button is absorbed by
const GUARD_STATE_KEY = "unsavedChangesGuard";
// past the duplicate entry and past the one the user actually asked to leave
const STEPS_BACK_ON_PROCEED = -2;

const readHistoryState = (): Record<string, unknown> => {
    const state: unknown = window.history.state;

    return typeof state === "object" && state !== null
        ? (state as Record<string, unknown>)
        : {};
};

const isGuardEntry = (state: unknown): boolean =>
    typeof state === "object" && state !== null && GUARD_STATE_KEY in state;

// the router keeps its own bookkeeping in history.state, so the marker is added to it rather
// than replacing it - a blank entry would leave the router unable to restore this route
const pushGuardEntry = () => {
    window.history.pushState(
        { ...readHistoryState(), [GUARD_STATE_KEY]: true },
        "",
        window.location.href,
    );
};

// an entry cannot be removed, but it can stop being a guard: once there is nothing to protect,
// the marker goes so a later back or forward onto it behaves like any other entry
const clearGuardEntry = () => {
    if (!isGuardEntry(window.history.state)) {
        return;
    }

    const withoutMarker = Object.fromEntries(
        Object.entries(readHistoryState()).filter(
            ([key]) => key !== GUARD_STATE_KEY,
        ),
    );

    window.history.replaceState(withoutMarker, "", window.location.href);
};

interface NavigationBlockerProviderProps {
    children: ReactNode;
}

// the framework has no navigation guard of its own, so each way out is closed separately: link
// clicks through components/ui/Link, programmatic navigation through hooks/useAppRouter, tab close
// through beforeunload, and the back button through the duplicate history entry below - the browser
// gives no way to cancel a pop after the fact
export const NavigationBlockerProvider = ({
    children,
}: NavigationBlockerProviderProps) => {
    const dirtyRefs = useRef(new Set<DirtyRef>());
    const guardEntryPushed = useRef(false);
    const [pending, setPending] = useState<{ perform: () => void } | null>(
        null,
    );

    const hasUnsavedChanges = useCallback(
        () => [...dirtyRefs.current].some((ref) => ref.current),
        [],
    );

    // the duplicate entry appears only once there is something to lose, so merely opening a form
    // leaves history untouched and its back button keeps working in one press
    const arm = useCallback((isArmed: boolean) => {
        if (isArmed === guardEntryPushed.current) {
            return;
        }

        guardEntryPushed.current = isArmed;

        if (isArmed) {
            pushGuardEntry();

            return;
        }

        clearGuardEntry();
    }, []);

    const register = useCallback((isDirtyRef: DirtyRef) => {
        dirtyRefs.current.add(isDirtyRef);

        return () => {
            dirtyRefs.current.delete(isDirtyRef);

            if (dirtyRefs.current.size === 0) {
                guardEntryPushed.current = false;
                clearGuardEntry();
            }
        };
    }, []);

    const defer = useCallback((perform: () => void) => {
        setPending({ perform });
    }, []);

    // the registry is not cleared here: a navigation that does not actually happen (a push to the
    // current route, a history step with nowhere to go) would leave the still-mounted form unguarded.
    // A form that really does leave unregisters itself on unmount
    const proceed = useCallback(() => {
        const run = pending?.perform;

        setPending(null);
        run?.();
    }, [pending]);

    const reset = useCallback(() => {
        setPending(null);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges()) {
                event.preventDefault();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // arriving on the duplicate entry itself, backwards or forwards: it carries the same
            // URL as its neighbour, so there is nothing to show and nothing to block
            if (isGuardEntry(event.state)) {
                return;
            }

            if (!guardEntryPushed.current || !hasUnsavedChanges()) {
                return;
            }

            pushGuardEntry();
            defer(() => {
                window.history.go(STEPS_BACK_ON_PROCEED);
            });
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [defer, hasUnsavedChanges]);

    const value = useMemo<NavigationBlockerValue>(
        () => ({
            register,
            arm,
            hasUnsavedChanges,
            defer,
            isBlocked: pending !== null,
            proceed,
            reset,
        }),
        [register, arm, hasUnsavedChanges, defer, pending, proceed, reset],
    );

    return (
        <NavigationBlockerContext value={value}>
            {children}
        </NavigationBlockerContext>
    );
};
