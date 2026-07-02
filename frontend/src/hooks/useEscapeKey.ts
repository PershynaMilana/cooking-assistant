import { useEffect } from "react";

export const useEscapeKey = (onEscape: () => void, enabled = true): void => {
    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onEscape();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled, onEscape]);
};
