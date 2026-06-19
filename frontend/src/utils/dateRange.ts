export type DateRangeError = "startAfterEnd" | "invalidRange";

// returns which rule a start/end date range violates, or null when valid. `now` is
// injected so the "no future dates" rule stays pure and testable. The returned key
// maps onto the `dateFilter.*` i18n messages.
export const getDateRangeError = (
    start: string,
    end: string,
    now: Date,
): DateRangeError | null => {
    const startAfterEnd =
        Boolean(start) && Boolean(end) && new Date(start) > new Date(end);

    if (startAfterEnd) {
        return "startAfterEnd";
    }

    const startInFuture = Boolean(start) && new Date(start) > now;
    const endInFuture = Boolean(end) && new Date(end) > now;

    if (startInFuture || endInFuture) {
        return "invalidRange";
    }

    return null;
};
