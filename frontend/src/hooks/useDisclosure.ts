import { useCallback, useState } from "react";

interface Disclosure {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

// open/close/toggle are useCallback-stable so a consumer forwarding them into
// another hook's dependency array (e.g. useEscapeKey) doesn't re-subscribe on
// every unrelated re-render
export const useDisclosure = (initialOpen = false): Disclosure => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);
    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return { isOpen, open, close, toggle };
};
