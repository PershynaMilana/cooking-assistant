import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
    FieldError,
    FormField,
    FormTextArea,
    PasswordField,
} from "components/forms/fields";

describe("FormField", () => {
    it("should render a labelled input bound to its value", () => {
        render(
            <FormField
                id="name"
                label="Name:"
                value="Soup"
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("Name:")).toHaveValue("Soup");
    });

    it("should call onChange with the typed character", async () => {
        const onChange = jest.fn();

        render(
            <FormField id="name" label="Name:" value="" onChange={onChange} />,
        );

        await userEvent.type(screen.getByLabelText("Name:"), "a");

        expect(onChange).toHaveBeenCalledWith("a");
    });

    it("should render the error message when provided", () => {
        render(
            <FormField
                id="name"
                label="Name:"
                value=""
                onChange={jest.fn()}
                error="Required"
            />,
        );

        expect(screen.getByText("Required")).toBeInTheDocument();
    });
});

describe("FormTextArea", () => {
    it("should render a labelled textarea bound to its value", () => {
        render(
            <FormTextArea
                id="desc"
                label="Description:"
                value="boil"
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("Description:")).toHaveValue("boil");
    });
});

describe("FieldError", () => {
    it("should render nothing when there is no message", () => {
        const { container } = render(<FieldError />);

        expect(container).toBeEmptyDOMElement();
    });
});

describe("PasswordField", () => {
    it("should render a labelled password input bound to its value", () => {
        render(
            <PasswordField
                id="pw"
                label="Password:"
                value="secret"
                onChange={jest.fn()}
                showLabel="Show"
                hideLabel="Hide"
            />,
        );

        const input = screen.getByLabelText("Password:");

        expect(input).toHaveValue("secret");
        expect(input).toHaveAttribute("type", "password");
    });

    it("should call onChange with the typed character", async () => {
        const onChange = jest.fn();

        render(
            <PasswordField
                id="pw"
                label="Password:"
                value=""
                onChange={onChange}
                showLabel="Show"
                hideLabel="Hide"
            />,
        );

        await userEvent.type(screen.getByLabelText("Password:"), "a");

        expect(onChange).toHaveBeenCalledWith("a");
    });

    it("should toggle the input between password and text", async () => {
        render(
            <PasswordField
                id="pw"
                label="Password:"
                value="secret"
                onChange={jest.fn()}
                showLabel="Show"
                hideLabel="Hide"
            />,
        );

        const input = screen.getByLabelText("Password:");

        expect(input).toHaveAttribute("type", "password");

        await userEvent.click(screen.getByRole("button", { name: "Show" }));

        expect(input).toHaveAttribute("type", "text");
        expect(
            screen.getByRole("button", { name: "Hide" }),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Hide" }));

        expect(input).toHaveAttribute("type", "password");
    });

    it("should render the error message when provided", () => {
        render(
            <PasswordField
                id="pw"
                label="Password:"
                value=""
                onChange={jest.fn()}
                showLabel="Show"
                hideLabel="Hide"
                error="Too short"
            />,
        );

        expect(screen.getByText("Too short")).toBeInTheDocument();
    });
});
