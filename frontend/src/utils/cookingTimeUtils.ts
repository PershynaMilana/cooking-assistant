// Parses a "h:mm" or "hh:mm" form input to total minutes.
// Returns null when the format is invalid or values are out of range.
export const parseCookingTime = (value: string): number | null => {
    const parts = value.split(":");

    if (parts.length !== 2) {
        return null;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    const isInvalid =
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 99 ||
        minutes < 0 ||
        minutes >= 60;

    if (isInvalid) {
        return null;
    }

    return hours * 60 + minutes;
};

export interface CookingTimeParts {
    hours: number;
    minutes: number;
}

// Splits total minutes into whole hours and remaining minutes - the single source
// of the "/60" math that display formatters and components build their labels on.
export const splitCookingTime = (totalMinutes: number): CookingTimeParts => ({
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
});

export const formatCookingTimeInput = (totalMinutes: number): string => {
    const { hours, minutes } = splitCookingTime(totalMinutes);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
