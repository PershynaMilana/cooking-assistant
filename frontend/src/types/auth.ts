export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    name: string;
    surname: string;
    login: string;
    password: string;
}
