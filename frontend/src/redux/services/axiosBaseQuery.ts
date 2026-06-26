import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { apiClient } from "api/client";
import {
    getApiErrorMessage,
    getApiErrorRetryAfter,
    getApiErrorStatus,
} from "api/httpError";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface AxiosBaseQueryArgs {
    url: string;
    method?: HttpMethod;
    data?: unknown;
    params?: unknown;
}

export interface AxiosBaseQueryError {
    status?: number;
    data: string;
    retryAfter: number | null;
}

export type AxiosBaseQueryFn = BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError
>;

interface RunRequestArgs {
    url: string;
    method: HttpMethod;
    data?: unknown;
    params?: unknown;
}

// run the request through our shared axios client, mapping the HTTP verb to the
// matching client method (the manual test mock only stubs the named methods, so
// we never call the instance as a function)
const runRequest = ({ url, method, data, params }: RunRequestArgs) => {
    switch (method) {
        case "POST":
            return apiClient.post<unknown>(url, data);
        case "PUT":
            return apiClient.put<unknown>(url, data);
        case "DELETE":
            return apiClient.delete<unknown>(url, { params });
        default:
            return apiClient.get<unknown>(url, { params });
    }
};

// RTK Query baseQuery on top of apiClient: success -> { data }, failure ->
// { error: { status, data } } with a user-facing message from getApiErrorMessage
export const axiosBaseQuery =
    (): AxiosBaseQueryFn =>
    async ({ url, method = "GET", data, params }) => {
        try {
            const response = await runRequest({ url, method, data, params });

            return { data: response.data };
        } catch (error: unknown) {
            return {
                error: {
                    status: getApiErrorStatus(error),
                    data: getApiErrorMessage(error),
                    retryAfter: getApiErrorRetryAfter(error),
                },
            };
        }
    };
