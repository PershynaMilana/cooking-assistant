import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { LoginRequest } from "types/auth";

import { useLoginMutation } from "redux/services/authApi";

import { getQueryErrorRetryAfter, getQueryErrorStatus } from "utils/queryError";

const EMPTY_FORM: LoginRequest = { login: "", password: "" };
const TOO_MANY_ATTEMPTS_STATUS = 429;
const SERVER_ERROR_STATUS_THRESHOLD = 500;
// used only when the server did not send a Retry-After header
const FALLBACK_LOCKOUT_SECONDS = 60;

// a failed login shows one generic message, never revealing whether the username or the password was wrong
export const useLoginForm = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const [login] = useLoginMutation();

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

        const result = await login(values);

        if ("data" in result) {
            navigate(ROUTES.main);

            return;
        }

        const status = getQueryErrorStatus(result.error);

        if (status === TOO_MANY_ATTEMPTS_STATUS) {
            const seconds =
                getQueryErrorRetryAfter(result.error) ??
                FALLBACK_LOCKOUT_SECONDS;

            setLockedUntil(Date.now() + seconds * 1000);
            setError(t("errors.tooManyAttempts", { seconds }));
        } else if (status !== null && status >= SERVER_ERROR_STATUS_THRESHOLD) {
            setError(t("errors.serverError"));
        } else {
            setError(t("errors.invalidCredentials"));
        }
    }, [isLocked, login, navigate, t, values]);

    return {
        values,
        error,
        setField,
        handleSubmit,
        isLocked,
    };
};
