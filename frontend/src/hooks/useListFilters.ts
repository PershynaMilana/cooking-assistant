"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { useAppRouter } from "hooks/useAppRouter";

import type { FilterDef } from "utils/filters/filterDef";
import {
    activeDefs as computeActiveDefs,
    buildParams,
    readState,
    resetState,
    writeState,
} from "utils/filters/filterState";

export interface ActiveFilterEntry<TParams> {
    def: FilterDef<unknown, TParams>;
    value: unknown;
    remove: () => void;
}

export interface SetFilterValueOptions {
    replace?: boolean;
}

export type SetFilterValue<TState> = <K extends keyof TState & string>(
    key: K,
    value: TState[K],
    options?: SetFilterValueOptions,
) => void;

export type SetFilterValues<TState> = (
    partial: Partial<TState>,
    options?: SetFilterValueOptions,
) => void;

export interface UseListFiltersResult<TState, TParams> {
    values: TState;
    setValue: SetFilterValue<TState>;
    setValues: SetFilterValues<TState>;
    reset: () => void;
    params: TParams;
    activeFilters: ActiveFilterEntry<TParams>[];
    activeCount: number;
    hasActiveFilters: boolean;
}

// URL is the single source of truth for filter state - values/params/activeFilters
// are all derived from it on every render, never cached in component or store state.
// readState returns a plain Record (filterState.ts isn't parameterized by TState -
// there's nothing in its inputs to infer it from), so the caller-specified TState is
// applied with one deliberate cast, right here, correct by construction: every key it
// reads comes from a def that was built for this exact TState (see recipeFilterDefs.ts)
export function useListFilters<TState extends object, TParams>(
    defs: readonly FilterDef<unknown, TParams>[],
): UseListFiltersResult<TState, TParams> {
    const router = useAppRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // a router push does not update useSearchParams() straight away, so a second write made
    // before the first one lands would merge onto pre-write state - resetting the filters and
    // immediately picking another one would silently keep both. Until some navigation lands,
    // the value we last asked for is the truth; any change to the URL hands control back to it
    const [requested, setRequested] = useState<{
        params: string;
        writtenOver: string;
    } | null>(null);
    const actualParams = searchParams.toString();

    if (requested !== null && requested.writtenOver !== actualParams) {
        setRequested(null);
    }

    const pendingParams =
        requested?.writtenOver === actualParams ? requested.params : null;
    const currentParams = useMemo(
        () =>
            pendingParams === null
                ? searchParams
                : new URLSearchParams(pendingParams),
        [pendingParams, searchParams],
    );

    const setSearchParams = useCallback(
        (next: URLSearchParams, options?: SetFilterValueOptions) => {
            const query = next.toString();
            const href = query ? `${pathname}?${query}` : pathname;

            // only remember the write once the navigation is under way: a write the guard
            // defers may be dropped, and the filters must not claim to be applied then
            const navigated = options?.replace
                ? router.replace(href)
                : router.push(href);

            if (navigated) {
                setRequested({ params: query, writtenOver: actualParams });
            }
        },
        [actualParams, pathname, router],
    );

    const rawValues = readState<TParams>(defs, currentParams);
    const values = rawValues as TState;
    const params = buildParams<TParams>(defs, rawValues);

    const setRaw = useCallback(
        (key: string, value: unknown, options?: SetFilterValueOptions) => {
            const nextValues = { ...rawValues, [key]: value };
            const next = writeState<TParams>(defs, nextValues, currentParams);

            setSearchParams(next, options);
        },
        [currentParams, defs, rawValues, setSearchParams],
    );

    const setValue = useCallback(
        <K extends keyof TState & string>(
            key: K,
            value: TState[K],
            options?: SetFilterValueOptions,
        ) => {
            setRaw(key, value, options);
        },
        [setRaw],
    );

    // updates several keys in one URL write - setValue() called several times in a row
    // would each read the same pre-update searchParams from this closure, so only the
    // last call would actually stick; this merges them all before writing once
    const setValues = useCallback(
        (partial: Partial<TState>, options?: SetFilterValueOptions) => {
            const nextValues = { ...rawValues, ...partial };
            const next = writeState<TParams>(defs, nextValues, currentParams);

            setSearchParams(next, options);
        },
        [currentParams, defs, rawValues, setSearchParams],
    );

    const reset = useCallback(() => {
        const next = writeState<TParams>(
            defs,
            resetState<TParams>(defs),
            currentParams,
        );

        setSearchParams(next);
    }, [currentParams, defs, setSearchParams]);

    const activeFilters: ActiveFilterEntry<TParams>[] =
        computeActiveDefs<TParams>(defs, rawValues).map(({ def, value }) => ({
            def,
            value,
            remove: () => {
                setRaw(def.key, def.defaultValue);
            },
        }));

    return {
        values,
        setValue,
        setValues,
        reset,
        params,
        activeFilters,
        activeCount: activeFilters.length,
        hasActiveFilters: activeFilters.length > 0,
    };
}
