export async function catchError(promise: Promise<unknown>): Promise<unknown> {
    return promise.catch((e: unknown) => e);
}

export function catchSyncError(callback: () => void): unknown {
    try {
        callback();
    } catch (error) {
        return error;
    }

    return undefined;
}
