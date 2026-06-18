import type { LoginRequest, LoginResponse, RegisterRequest } from "types/auth";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        API_ROUTES.auth.login,
        credentials,
    );

    return response.data;
}

export async function register(data: RegisterRequest): Promise<void> {
    await apiClient.post(API_ROUTES.auth.register, data);
}
