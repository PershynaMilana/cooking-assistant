"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { useNavigationBlocker } from "components/layout/NavigationBlocker";

// href is narrowed to a string: every destination in this app comes from constants/routes
export type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
    href: string;
};

// the only link component in the app: a bare next/link would navigate straight past the
// unsaved-changes guard, and nothing at the call site would show that it does
export const Link = ({ href, replace, onNavigate, ...rest }: LinkProps) => {
    const router = useRouter();
    const { hasUnsavedChanges, defer } = useNavigationBlocker();

    const handleNavigate = (event: { preventDefault: () => void }) => {
        if (hasUnsavedChanges()) {
            event.preventDefault();
            // the deferred navigation has to be the one the link asked for, replace included
            defer(() => {
                if (replace === true) {
                    router.replace(href);

                    return;
                }

                router.push(href);
            });

            return;
        }

        onNavigate?.(event);
    };

    return (
        <NextLink
            href={href}
            replace={replace}
            onNavigate={handleNavigate}
            {...rest}
        />
    );
};
