import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { Provider } from "react-redux";
import type * as ReactRouterDom from "react-router-dom";

import { API_ROUTES } from "api/endpoints";

import { useRegisterForm } from "hooks/useRegisterForm";

import { mockedPost } from "test/apiClientMock";
import { mockNavigate } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/client");

interface FormResult {
    current: ReturnType<typeof useRegisterForm>;
}

const wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(Provider, { store: makeTestStore(), children });

const renderRegisterForm = () =>
    renderHook(() => useRegisterForm(), { wrapper });

const setField = (
    result: FormResult,
    field: "name" | "surname" | "login" | "password",
    value: string,
) => {
    act(() => {
        result.current.setField(field, value);
    });
};

const fillValid = (result: FormResult) => {
    setField(result, "name", "Test");
    setField(result, "surname", "User");
    setField(result, "login", "tester");
    setField(result, "password", "secret1");
};

const submit = (result: FormResult) =>
    act(async () => {
        await result.current.handleSubmit();
    });

describe("useRegisterForm", () => {
    it("should register the user and navigate to login when all fields are valid", async () => {
        mockedPost.mockResolvedValue({ data: null });

        const { result } = renderRegisterForm();

        fillValid(result);
        await submit(result);

        expect(mockedPost).toHaveBeenCalledWith(API_ROUTES.auth.register, {
            name: "Test",
            surname: "User",
            login: "tester",
            password: "secret1",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should not submit and should set a field error when the name is invalid", async () => {
        const { result } = renderRegisterForm();

        setField(result, "name", "test");
        setField(result, "surname", "User");
        setField(result, "login", "tester");
        setField(result, "password", "secret1");
        await submit(result);

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.errors.name).toBe(
            "Name must start with a capital letter and contain only letters, at least 2 characters.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should not submit and should set a field error when the surname is invalid", async () => {
        const { result } = renderRegisterForm();

        setField(result, "name", "Test");
        setField(result, "surname", "user");
        setField(result, "login", "tester");
        setField(result, "password", "secret1");
        await submit(result);

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.errors.surname).toBe(
            "Surname must start with a capital letter and contain only letters, at least 2 characters.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should not submit and should set a field error when the login is invalid", async () => {
        const { result } = renderRegisterForm();

        setField(result, "name", "Test");
        setField(result, "surname", "User");
        setField(result, "login", "a");
        setField(result, "password", "secret1");
        await submit(result);

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.errors.login).toBeDefined();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should reject a short password without submitting", async () => {
        const { result } = renderRegisterForm();

        setField(result, "name", "Test");
        setField(result, "surname", "User");
        setField(result, "login", "tester");
        setField(result, "password", "short");
        await submit(result);

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.errors.password).toBe(
            "Password must be at least 6 characters.",
        );
    });

    it("should set a required-fields error when a field is empty", async () => {
        const { result } = renderRegisterForm();

        await submit(result);

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Please fill in all fields.");
    });

    it("should set a generic error when registration fails", async () => {
        mockedPost.mockRejectedValue(
            Object.assign(new Error(), {
                isAxiosError: true,
                response: { status: 409, data: { error: "exists" } },
            }),
        );

        const { result } = renderRegisterForm();

        fillValid(result);
        await submit(result);

        expect(result.current.error).toBe("This user already exists.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
