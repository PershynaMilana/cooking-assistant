import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RecipeTypeForm } from "components/forms/RecipeTypeForm";

const DATA = { type_name: "Soup", description: "warm" };

describe("RecipeTypeForm", () => {
    it("should render the name and description fields with their values", () => {
        render(
            <RecipeTypeForm
                typeData={DATA}
                errors={{}}
                onFieldChange={jest.fn()}
                onSubmit={jest.fn()}
                submitLabel="Add"
            />,
        );

        expect(screen.getByLabelText("Name:")).toHaveValue("Soup");
        expect(screen.getByLabelText("Description:")).toHaveValue("warm");
    });

    it("should call onFieldChange with the field name and value", async () => {
        const onFieldChange = jest.fn();

        render(
            <RecipeTypeForm
                typeData={{ type_name: "", description: "" }}
                errors={{}}
                onFieldChange={onFieldChange}
                onSubmit={jest.fn()}
                submitLabel="Add"
            />,
        );

        await userEvent.type(screen.getByLabelText("Name:"), "a");

        expect(onFieldChange).toHaveBeenCalledWith("type_name", "a");
    });

    it("should call onSubmit when the form is submitted", async () => {
        const onSubmit = jest.fn();

        render(
            <RecipeTypeForm
                typeData={DATA}
                errors={{}}
                onFieldChange={jest.fn()}
                onSubmit={onSubmit}
                submitLabel="Add"
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("should render a field error", () => {
        render(
            <RecipeTypeForm
                typeData={{ type_name: "", description: "" }}
                errors={{ type_name: "Required" }}
                onFieldChange={jest.fn()}
                onSubmit={jest.fn()}
                submitLabel="Add"
            />,
        );

        expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("should render the submit error when provided", () => {
        render(
            <RecipeTypeForm
                typeData={DATA}
                errors={{}}
                onFieldChange={jest.fn()}
                onSubmit={jest.fn()}
                submitLabel="Add"
                submitError="Name already taken."
            />,
        );

        expect(screen.getByText("Name already taken.")).toBeInTheDocument();
    });

    it("should not render a submit error when submitError is absent", () => {
        render(
            <RecipeTypeForm
                typeData={DATA}
                errors={{}}
                onFieldChange={jest.fn()}
                onSubmit={jest.fn()}
                submitLabel="Add"
            />,
        );

        expect(
            screen.queryByText("Name already taken."),
        ).not.toBeInTheDocument();
    });
});
