import type { LoginRequest, RegisterRequest } from "types/auth";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function login(credentials: LoginRequest): Promise<void> {
    await apiClient.post(API_ROUTES.auth.login, credentials);
}

export async function getMe(): Promise<void> {
    await apiClient.get(API_ROUTES.auth.me);
}

export async function register(data: RegisterRequest): Promise<void> {
    await apiClient.post(API_ROUTES.auth.register, data);
}

export async function logout(): Promise<void> {
    await apiClient.post(API_ROUTES.auth.logout);
}
