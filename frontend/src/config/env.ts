// dev uses a relative base so requests are same-origin and the Vite proxy forwards
// /api to the backend (so the httpOnly auth cookie is first-party); prod points at
// the deployed API via VITE_API_URL
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
