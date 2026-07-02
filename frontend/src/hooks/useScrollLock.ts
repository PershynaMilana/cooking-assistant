import { useEffect } from "react";

// module-level so simultaneous locks (e.g. the mobile nav drawer and the News
// modal both open at once) compose correctly - only the first lock captures
// the prior overflow, and only the last unlock restores it
let lockCount = 0;
let previousOverflow = "";

export const useScrollLock = (locked: boolean): void => {
    useEffect(() => {
        if (!locked) {
            return undefined;
        }

        if (lockCount === 0) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        }
        lockCount += 1;

        return () => {
            lockCount -= 1;
            if (lockCount === 0) {
                document.body.style.overflow = previousOverflow;
            }
        };
    }, [locked]);
};
