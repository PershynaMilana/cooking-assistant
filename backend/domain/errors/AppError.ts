export class AppError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}
