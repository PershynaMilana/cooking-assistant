process.env.JWT_SECRET_KEY ??= "test-secret";

expect.extend({
    toBeAppError(
        received: unknown,
        ErrorClass: new (message: string) => Error,
        message: string,
        status: number,
    ) {
        const pass =
            received instanceof ErrorClass &&
            received.message === message &&
            "status" in received &&
            received.status === status;

        return {
            pass,
            message: () =>
                `expected error to be ${ErrorClass.name} with message "${message}" and status ${status}`,
        };
    },
});

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeAppError(
                ErrorClass: new (message: string) => Error,
                message: string,
                status: number,
            ): R;
        }
    }
}

export {};
