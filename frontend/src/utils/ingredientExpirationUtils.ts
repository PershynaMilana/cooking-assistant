// Returns true when the ingredient's shelf life has ended.
// Both params are optional because the API fields are optional.
export const isExpired = (
    purchaseDate: string | undefined,
    daysToExpire: number | null,
): boolean => {
    if (!purchaseDate || daysToExpire === null) {
        return false;
    }

    const expiresAt = new Date(purchaseDate);

    expiresAt.setDate(expiresAt.getDate() + daysToExpire);

    return new Date() >= expiresAt;
};
