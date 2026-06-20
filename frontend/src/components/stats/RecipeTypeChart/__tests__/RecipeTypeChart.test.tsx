import { render } from "@testing-library/react";
import { Suspense } from "react";

import { RecipeTypeChart } from "components/stats/RecipeTypeChart";

jest.mock("react-apexcharts", () => ({
    __esModule: true,
    default: () => null,
}));

describe("RecipeTypeChart", () => {
    it("should render without errors", () => {
        const { container } = render(
            <Suspense fallback={null}>
                <RecipeTypeChart stats={[{ typeName: "Soup", count: 2 }]} />
            </Suspense>,
        );

        expect(container).toBeInTheDocument();
    });
});
