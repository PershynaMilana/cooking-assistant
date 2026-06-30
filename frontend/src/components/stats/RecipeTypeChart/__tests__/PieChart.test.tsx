import { render, screen } from "@testing-library/react";

import {
    CHART_COLORS,
    getChartColor,
} from "components/stats/RecipeTypeChart/chartColors";
import PieChart from "components/stats/RecipeTypeChart/PieChart";

jest.mock("recharts", () => ({
    PieChart: ({ children }: { children: React.ReactNode }) => (
        <svg data-testid="pie-chart">{children}</svg>
    ),
    Pie: ({
        children,
        data,
    }: {
        children: React.ReactNode;
        data: { typeName: string; count: number }[];
    }) => (
        <g data-testid="pie">
            {data.map((d) => (
                <circle key={d.typeName} data-name={d.typeName} />
            ))}
            {children}
        </g>
    ),
    Cell: ({ fill }: { fill: string }) => (
        <rect data-testid="cell" data-fill={fill} />
    ),
    Tooltip: () => null,
}));

describe("PieChart", () => {
    it("should render the pie chart container", () => {
        render(<PieChart stats={[{ typeName: "Soup", count: 4 }]} />);

        expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    it("should render one cell per stat with brand colors", () => {
        render(
            <PieChart
                stats={[
                    { typeName: "Soup", count: 4 },
                    { typeName: "Dessert", count: 2 },
                ]}
            />,
        );

        const cells = screen.getAllByTestId("cell");

        expect(cells).toHaveLength(2);
        expect(cells[0]).toHaveAttribute("data-fill", CHART_COLORS[0]);
        expect(cells[1]).toHaveAttribute("data-fill", CHART_COLORS[1]);
    });

    it("should display the total recipe count in the center", () => {
        render(
            <PieChart
                stats={[
                    { typeName: "Soup", count: 6 },
                    { typeName: "Dessert", count: 9 },
                ]}
            />,
        );

        expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should display the recipes i18n label in the center", () => {
        render(<PieChart stats={[{ typeName: "Soup", count: 1 }]} />);

        expect(screen.getByText("recipes")).toBeInTheDocument();
    });

    it("should render with empty stats showing zero total", () => {
        render(<PieChart stats={[]} />);

        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.queryAllByTestId("cell")).toHaveLength(0);
    });

    it("should cycle colors when stats exceed palette size", () => {
        const stats = Array.from({ length: 7 }, (_, i) => ({
            typeName: `Type${i}`,
            count: 1,
        }));

        render(<PieChart stats={stats} />);

        const cells = screen.getAllByTestId("cell");

        expect(cells).toHaveLength(7);
        expect(cells[6]).toHaveAttribute(
            "data-fill",
            CHART_COLORS[6 % CHART_COLORS.length],
        );
    });

    it("should render legend entries for each stat", () => {
        render(
            <PieChart
                stats={[
                    { typeName: "Soup", count: 6 },
                    { typeName: "Dessert", count: 9 },
                ]}
            />,
        );

        expect(screen.getByText("Soup: 6")).toBeInTheDocument();
        expect(screen.getByText("Dessert: 9")).toBeInTheDocument();
    });

    it("should render no legend entries for empty stats", () => {
        render(<PieChart stats={[]} />);

        expect(screen.queryByText(/:/)).toBeNull();
    });
});

describe("getChartColor", () => {
    it("should return the color at the given index", () => {
        expect(getChartColor(0)).toBe(CHART_COLORS[0]);
        expect(getChartColor(2)).toBe(CHART_COLORS[2]);
    });

    it("should wrap around when index exceeds palette length", () => {
        expect(getChartColor(CHART_COLORS.length)).toBe(CHART_COLORS[0]);
        expect(getChartColor(CHART_COLORS.length + 1)).toBe(CHART_COLORS[1]);
    });
});
