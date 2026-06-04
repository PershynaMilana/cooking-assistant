//? Wraps an async route handler so rejected promises go to the error middleware.
//? Express 4 does not catch async errors on its own, so every async handler is wrapped with this.
const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

module.exports = asyncHandler;
