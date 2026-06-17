import "@testing-library/jest-dom";

// keep tests isolated from each other's auth-token / pantry state
afterEach(() => localStorage.clear());
