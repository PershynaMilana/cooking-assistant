import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import { register } from "api/authApi";

import { useRegisterForm } from "hooks/useRegisterForm";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/authApi");

interface FormResult {
    current: ReturnType<typeof useRegisterForm>;
}

const fillValid = (result: FormResult) => {
    act(() => {
        result.current.setField("name", "Test");
    });
    act(() => {
        result.current.setField("surname", "User");
    });
    act(() => {
        result.current.setField("login", "tester");
    });
    act(() => {
        result.current.setField("password", "secret1");
    });
};

describe("useRegisterForm", () => {
    it("should register the user and navigate to login when all fields are valid", async () => {
        jest.mocked(register).mockResolvedValue(undefined);

        const { result } = renderHook(() => useRegisterForm());

        fillValid(result);

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).toHaveBeenCalledWith({
            name: "Test",
            surname: "User",
            login: "tester",
            password: "secret1",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should not submit and should set a field error when the name is invalid", async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setField("name", "test");
        });
        act(() => {
            result.current.setField("surname", "User");
        });
        act(() => {
            result.current.setField("login", "tester");
        });
        act(() => {
            result.current.setField("password", "secret1");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).not.toHaveBeenCalled();
        expect(result.current.errors.name).toBe(
            "Name must start with a capital letter and contain only letters, at least 2 characters.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should not submit and should set a field error when the surname is invalid", async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setField("name", "Test");
        });
        act(() => {
            result.current.setField("surname", "user");
        });
        act(() => {
            result.current.setField("login", "tester");
        });
        act(() => {
            result.current.setField("password", "secret1");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).not.toHaveBeenCalled();
        expect(result.current.errors.surname).toBe(
            "Surname must start with a capital letter and contain only letters, at least 2 characters.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should not submit and should set a field error when the login is invalid", async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setField("name", "Test");
        });
        act(() => {
            result.current.setField("surname", "User");
        });
        act(() => {
            result.current.setField("login", "a");
        });
        act(() => {
            result.current.setField("password", "secret1");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).not.toHaveBeenCalled();
        expect(result.current.errors.login).toBeDefined();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should reject a short password without submitting", async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setField("name", "Test");
        });
        act(() => {
            result.current.setField("surname", "User");
        });
        act(() => {
            result.current.setField("login", "tester");
        });
        act(() => {
            result.current.setField("password", "short");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).not.toHaveBeenCalled();
        expect(result.current.errors.password).toBe(
            "Password must be at least 6 characters.",
        );
    });

    it("should set a required-fields error when a field is empty", async () => {
        const { result } = renderHook(() => useRegisterForm());

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(register)).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Please fill in all fields.");
    });

    it("should set a generic error when registration fails", async () => {
        jest.mocked(register).mockRejectedValue(new Error("409"));

        const { result } = renderHook(() => useRegisterForm());

        fillValid(result);

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.error).toBe("This user already exists.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
