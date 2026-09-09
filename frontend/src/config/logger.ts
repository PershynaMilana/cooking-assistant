const isDev = process.env.NODE_ENV !== "production";

// the browser console stays quiet in production, but a server render has no other voice: its
// output is the container's log, and a swallowed failure there is invisible to everyone
const isServer = typeof window === "undefined";
const reportsProblems = isDev || isServer;

export const logger = {
    error: (...args: unknown[]) => {
        if (reportsProblems) console.error(...args);
    },
    warn: (...args: unknown[]) => {
        if (reportsProblems) console.warn(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) console.info(...args);
    },
    debug: (...args: unknown[]) => {
        if (isDev) console.debug(...args);
    },
};
