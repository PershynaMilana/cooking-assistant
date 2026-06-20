import { ROUTES } from "constants/routes";

// hard navigation used from outside the Router (the axios auth interceptor)
export function redirectToLogin(): void {
    window.location.assign(ROUTES.login);
}
