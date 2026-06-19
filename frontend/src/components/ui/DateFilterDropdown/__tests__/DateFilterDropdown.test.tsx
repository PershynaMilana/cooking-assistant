import { render, screen } from "@testing-library/react";
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
