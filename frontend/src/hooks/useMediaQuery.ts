import { useEffect, useState } from "react";

// the server has no window at all, and jsdom has no matchMedia
const getMediaQueryList = (query: string): MediaQueryList | null =>
    typeof window === "undefined" || typeof window.matchMedia !== "function"
        ? null
        : window.matchMedia(query);

export const useMediaQuery = (query: string): boolean => {
    // false for the server render and the first client render alike - reading the real value
    // here instead would hydrate a phone with the markup the server built for a desktop. The
    // effect below corrects it in the same commit as hydration
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = getMediaQueryList(query);

        if (!mql) {
            return undefined;
        }

        const handleChange = () => {
            setMatches(mql.matches);
        };

        handleChange();
        mql.addEventListener("change", handleChange);

        return () => {
            mql.removeEventListener("change", handleChange);
        };
    }, [query]);

    return matches;
};
