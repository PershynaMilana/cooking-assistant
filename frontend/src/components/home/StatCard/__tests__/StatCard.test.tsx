import { render, screen } from "@testing-library/react";
import { BookOpen } from "lucide-react";

import { StatCard } from "components/home/StatCard";

describe("StatCard", () => {
    it("should render the value and label", () => {
        render(<StatCard icon={BookOpen} value={12} label="Recipes" />);

        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("Recipes")).toBeInTheDocument();
    });

    it("should render the value and label with the warning tone", () => {
        render(
            <StatCard
                icon={BookOpen}
                value={3}
                label="Expiring soon"
                tone="warning"
            />,
        );

        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("Expiring soon")).toBeInTheDocument();
    });
});
