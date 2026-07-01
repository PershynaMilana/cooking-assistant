import { screen } from "@testing-library/react";

import type { RecipeWithIngredientNames } from "types/recipe";

import { API_ROUTES } from "api/endpoints";

import StatsPage from "pages/statistics/StatsPage";
import { mockGetByUrl } from "test/apiClientMock";
import { renderWithRouter } from "test/router";

jest.mock("api/client");

// recharts cannot fully render under jsdom (SVG/ResizeObserver), so it is stubbed out
jest.mock("components/stats/PieChartCard/PieChartCard", () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock("components/stats/MenuStatsSummary", () => ({
    MenuStatsSummary: () => <div data-testid="menu-stats" />,
}));

jest.mock("components/stats/MenuCategoryChart", () => ({
    MenuCategoryChart: () => <div data-testid="menu-category-chart" />,
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

const stubData = () => {
    mockGetByUrl({
        [API_ROUTES.recipes.list]: SAMPLE,
        [API_ROUTES.menu.allUnpaginated]: [],
    });
};

describe("StatsPage", () => {
    it("should render the recipe statistics heading", () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(screen.getByText("Recipe Statistics")).toBeInTheDocument();
    });

    it("should render the recipe type chart", async () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(await screen.findByText(TYPE_NAME)).toBeInTheDocument();
    });

    it("should render the recipe types summary", () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(screen.getByText("Recipe Types Summary")).toBeInTheDocument();
    });

    it("should render the menu stats section", () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(screen.getByTestId("menu-stats")).toBeInTheDocument();
    });

    it("should render the menu category chart", () => {
        stubData();

        renderWithRouter(<StatsPage />);

        expect(screen.getByTestId("menu-category-chart")).toBeInTheDocument();
    });
});
