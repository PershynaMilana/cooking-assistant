import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

import { API_BASE_URL } from "config/env";
import { AUTH_TOKEN_KEY } from "constants/storage";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
    },
);
