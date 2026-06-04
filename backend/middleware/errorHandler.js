//? Single place that turns a thrown error into an HTTP response.
//? Keeps the { error } body shape the rest of the API already uses.
const errorHandler = (err, req, res, _next) => {
    console.error(err);

    // if the response already started, let Express close the connection
    if (res.headersSent) {
        return _next(err);
    }

    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Server error" });
};

module.exports = errorHandler;
