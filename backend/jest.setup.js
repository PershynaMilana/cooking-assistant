expect.extend({
    toBeAppError(received, ErrorClass, message, status) {
        const pass =
            received instanceof ErrorClass &&
            received.message === message &&
            received.status === status;

        return {
            pass,
            message: () =>
                `expected error to be ${ErrorClass.name} with message "${message}" and status ${status}`,
        };
    },
});
