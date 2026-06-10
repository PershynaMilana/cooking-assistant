async function catchError(promise) {
    return promise.catch((e) => e);
}

function catchSyncError(callback) {
    try {
        callback();
    } catch (error) {
        return error;
    }

    return undefined;
}

module.exports = {
    catchError,
    catchSyncError,
};
