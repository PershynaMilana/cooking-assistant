import { screen } from "@testing-library/react";
import StatsPage from "../StatsPage";
import { getRecipes } from "../../../api/recipesApi";
import { renderWithRouter } from "../../../test/router";
import type { RecipeWithIngredientNames } from "../../../types/recipe";

jest.mock("../../../api/recipesApi");

// react-apexcharts and @react-pdf/renderer cannot render under jsdom (canvas /
// PDF), so they are stubbed out; StyleSheet.create covers module-level calls in
// the StatsReport components imported by the page
jest.mock("react-apexcharts", () => ({
    __esModule: true,
    default: () => null,
}));
jest.mock("@react-pdf/renderer", () => ({
    PDFDownloadLink: () => null,
    Document: () => null,
    Page: () => null,
    Text: () => null,
    View: () => null,
    Image: () => null,
    StyleSheet: { create: (styles: unknown) => styles },
    Font: { register: () => undefined },
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

describe("StatsPage", () => {
    it("should render statistics computed from the loaded recipes", async () => {
        jest.mocked(getRecipes).mockResolvedValue(SAMPLE);

        renderWithRouter(<StatsPage />);

        expect(screen.getByText("Recipe Statistics")).toBeInTheDocument();
        expect(await screen.findByText(TYPE_NAME)).toBeInTheDocument();
    });
});
