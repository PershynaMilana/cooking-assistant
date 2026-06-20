import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { LoginRequest } from "types/auth";

import { login as loginRequest } from "api/authApi";
import { isAxiosError } from "api/client";

const EMPTY_FORM: LoginRequest = { login: "", password: "" };

// a failed login shows one generic message, never revealing whether the username or the password was wrong
export const useLoginForm = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();

    const [values, setValues] = useState<LoginRequest>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);

    useEffect(() => {
        if (lockedUntil === null) return undefined;

        const remaining = lockedUntil - Date.now();

        if (remaining <= 0) {
            setLockedUntil(null);

            return undefined;
        }

        const timer = setTimeout(() => {
            setLockedUntil(null);
            setError(null);
        }, remaining);

        return () => {
            clearTimeout(timer);
        };
    }, [lockedUntil]);

    const setField = useCallback((field: keyof LoginRequest, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    }, []);

    const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

    const handleSubmit = useCallback(async () => {
        if (isLocked) return;

        setError(null);

        if (!values.login || !values.password) {
            setError(t("errors.allFieldsRequired"));

            return;
        }

        try {
            await loginRequest(values);
            navigate(ROUTES.main);
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 429) {
                const raw = Number(err.response.headers["retry-after"]);
                const seconds = Number.isFinite(raw) && raw > 0 ? raw : 60;

                setLockedUntil(Date.now() + seconds * 1000);
                setError(t("errors.tooManyAttempts", { seconds }));
            } else {
                setError(t("errors.invalidCredentials"));
            }
        }
    }, [isLocked, navigate, t, values]);

    return {
        values,
        error,
        setField,
        handleSubmit,
        isLocked,
    };
};
