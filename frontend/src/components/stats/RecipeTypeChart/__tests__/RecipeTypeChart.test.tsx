import { render, screen } from "@testing-library/react";
import { Suspense } from "react";

import type { RecipeTypeStat } from "types/stats";

import { RecipeTypeChart } from "components/stats/RecipeTypeChart";

jest.mock("components/stats/RecipeTypeChart/PieChart", () => ({
    __esModule: true,
    default: ({ stats }: { stats: RecipeTypeStat[] }) => (
        <div data-testid="donut-chart">
            {stats.map((s) => (
                <span key={s.typeName}>{s.typeName}</span>
            ))}
        </div>
    ),
}));

describe("RecipeTypeChart", () => {
    it("should render the chart and pass stats to the donut", async () => {
        render(
            <Suspense fallback={null}>
                <RecipeTypeChart stats={[{ typeName: "Soup", count: 3 }]} />
            </Suspense>,
        );

        expect(await screen.findByTestId("donut-chart")).toBeInTheDocument();
        expect(screen.getByText("Soup")).toBeInTheDocument();
    });

    it("should render with empty stats without errors", async () => {
        render(
            <Suspense fallback={null}>
                <RecipeTypeChart stats={[]} />
            </Suspense>,
        );

        expect(await screen.findByTestId("donut-chart")).toBeInTheDocument();
    });
});
