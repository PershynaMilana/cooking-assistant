import { render } from "@testing-library/react";

import { RecipeTypeChart } from "components/stats/RecipeTypeChart";

jest.mock("react-apexcharts", () => ({
    __esModule: true,
    default: () => null,
}));

describe("RecipeTypeChart", () => {
    it("should render without errors", () => {
        const { container } = render(
            <RecipeTypeChart stats={[{ typeName: "Soup", count: 2 }]} />,
        );

        expect(container).toBeInTheDocument();
    });
});
