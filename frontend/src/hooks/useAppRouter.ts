"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { useNavigationBlocker } from "components/layout/NavigationBlocker";

export interface AppRouter {
    // both report whether the navigation actually started: it is deferred, and may be dropped
    // altogether, when a form holds unsaved changes
    push: (href: string) => boolean;
    replace: (href: string) => boolean;
}

// the only way pages and hooks navigate programmatically: next/router itself cannot be
// intercepted, so every push/replace is routed through the unsaved-changes guard here
export const useAppRouter = (): AppRouter => {
    const router = useRouter();
    const { hasUnsavedChanges, defer } = useNavigationBlocker();

    const run = useCallback(
        (perform: () => void) => {
            if (hasUnsavedChanges()) {
                defer(perform);

                return false;
            }

            perform();

            return true;
        },
        [defer, hasUnsavedChanges],
    );

    return useMemo(
        () => ({
            push: (href: string) =>
                run(() => {
                    router.push(href);
                }),
            replace: (href: string) =>
                run(() => {
                    router.replace(href);
                }),
        }),
        [router, run],
    );
};
