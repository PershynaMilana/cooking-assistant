import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateFilterDropdown } from "components/ui/DateFilterDropdown";

import { BTN_RESET_FILTERS } from "test/constants";

const TOGGLE = "Sort by dates";
const START_LABEL = "Start date:";

describe("DateFilterDropdown", () => {
    it("should reveal the date inputs when opened", async () => {
        render(
            <DateFilterDropdown
                startDate=""
                endDate=""
                setStartDate={jest.fn()}
                setEndDate={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: TOGGLE }));

        expect(screen.getByLabelText(START_LABEL)).toBeInTheDocument();
        expect(screen.getByLabelText("End date:")).toBeInTheDocument();
    });

    it("should propagate the chosen start date when it changes", async () => {
        const setStartDate = jest.fn();

        render(
            <DateFilterDropdown
                startDate=""
                endDate=""
                setStartDate={setStartDate}
                setEndDate={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: TOGGLE }));
        fireEvent.change(screen.getByLabelText(START_LABEL), {
            target: { value: "2024-01-01" },
        });

        expect(setStartDate).toHaveBeenCalledWith("2024-01-01");
    });

    it("should propagate the chosen end date when it changes", async () => {
        const setEndDate = jest.fn();

        render(
            <DateFilterDropdown
                startDate=""
                endDate=""
                setStartDate={jest.fn()}
                setEndDate={setEndDate}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: TOGGLE }));
        fireEvent.change(screen.getByLabelText("End date:"), {
            target: { value: "2024-02-01" },
        });

        expect(setEndDate).toHaveBeenCalledWith("2024-02-01");
    });

    it("should show an error when the start date is after the end date", async () => {
        render(
            <DateFilterDropdown
                startDate="2024-02-01"
                endDate="2024-01-01"
                setStartDate={jest.fn()}
                setEndDate={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: TOGGLE }));

        expect(
            await screen.findByText(
                "Start date cannot be later than end date.",
            ),
        ).toBeInTheDocument();
    });

    it("should clear both dates when the filters are reset", async () => {
        const setStartDate = jest.fn();
        const setEndDate = jest.fn();

        render(
            <DateFilterDropdown
                startDate="2024-01-01"
                endDate="2024-02-01"
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: TOGGLE }));
        await userEvent.click(
            screen.getByRole("button", { name: BTN_RESET_FILTERS }),
        );

        expect(setStartDate).toHaveBeenCalledWith("");
        expect(setEndDate).toHaveBeenCalledWith("");
    });
});
