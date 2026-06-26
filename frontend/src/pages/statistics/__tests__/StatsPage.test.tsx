import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecipeWithIngredientNames } from "types/recipe";

import { API_ROUTES } from "api/endpoints";

import StatsPage from "pages/statistics/StatsPage";
import { mockGetByUrl } from "test/apiClientMock";
import { flushMacrotasks as flushAsync } from "test/flush";
import { renderWithRouter } from "test/router";

jest.mock("api/client");

// react-apexcharts cannot render under jsdom (canvas), so it is stubbed out
jest.mock("react-apexcharts", () => ({
    __esModule: true,
    default: () => null,
}));

const mockToBlob = jest.fn();

// the page lazily imports the PDF renderer and report documents on download;
// stub them so no real @react-pdf/renderer document is built under jsdom
jest.mock("@react-pdf/renderer", () => ({
    __esModule: true,
    pdf: () => ({ toBlob: mockToBlob }),
}));
jest.mock("../StatsReport", () => ({
    __esModule: true,
    StatsReport: () => null,
}));
jest.mock("../StatsReportSecond", () => ({
    __esModule: true,
    StatsReportSecond: () => null,
}));

const TYPE_NAME = "Soup";
const SAMPLE: RecipeWithIngredientNames[] = [
    {
        id: 1,
        title: "Borscht",
        type_name: TYPE_NAME,
        creation_date: "2024-01-01",
        cooking_time: 60,
        ingredients: ["beet"],
    },
];

const REPORT_FAILED = "Failed to generate report. Please try again.";

const stubData = () => {
    mockGetByUrl({
        [API_ROUTES.recipes.list]: SAMPLE,
        [API_ROUTES.menu.list]: [],
    });
};

describe("StatsPage", () => {
    it("should render statistics computed from the loaded recipes", async () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(screen.getByText("Recipe Statistics")).toBeInTheDocument();
        expect(await screen.findByText(TYPE_NAME)).toBeInTheDocument();
    });

    it("should download the recipe statistics report as a pdf", async () => {
        stubData();
        mockToBlob.mockResolvedValue(new Blob(["report"]));

        const createObjectURL = jest.fn(() => "blob:url");
        const revokeObjectURL = jest.fn();

        URL.createObjectURL = createObjectURL;
        URL.revokeObjectURL = revokeObjectURL;

        const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click");

        renderWithRouter(<StatsPage />);

        await userEvent.click(
            screen.getByRole("button", { name: "Statistics Report PDF" }),
        );
        await flushAsync();

        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");
    });

    it("should download the second statistics report as a pdf", async () => {
        stubData();
        mockToBlob.mockResolvedValue(new Blob(["report"]));

        const createObjectURL = jest.fn(() => "blob:url");

        URL.createObjectURL = createObjectURL;
        URL.revokeObjectURL = jest.fn();

        renderWithRouter(<StatsPage />);

        await userEvent.click(
            screen.getByRole("button", {
                name: "Statistics Report PDF - Option 2",
            }),
        );
        await flushAsync();

        expect(createObjectURL).toHaveBeenCalledTimes(1);
    });

    it("should show an error message when report generation fails", async () => {
        stubData();
        mockToBlob.mockRejectedValue(new Error("boom"));

        renderWithRouter(<StatsPage />);

        await userEvent.click(
            screen.getByRole("button", { name: "Statistics Report PDF" }),
        );

        expect(await screen.findByText(REPORT_FAILED)).toBeInTheDocument();
    });

    it("should show an error message when the second report generation fails", async () => {
        stubData();
        mockToBlob.mockRejectedValue(new Error("boom"));

        renderWithRouter(<StatsPage />);

        await userEvent.click(
            screen.getByRole("button", {
                name: "Statistics Report PDF - Option 2",
            }),
        );

        expect(await screen.findByText(REPORT_FAILED)).toBeInTheDocument();
    });
});
