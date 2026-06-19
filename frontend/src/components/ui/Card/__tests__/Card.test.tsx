import { screen } from "@testing-library/react";

import { Card, CardMetaRow } from "components/ui/Card";

import { renderWithRouter } from "test/router";

describe("Card", () => {
    it("should render the title, body content and a link button to the target", () => {
        renderWithRouter(
            <Card title="Borscht" to="/recipe/1" actionLabel="Learn more">
                <CardMetaRow label="Type: " value="Soup" />
            </Card>,
        );

        expect(screen.getByText("Borscht")).toBeInTheDocument();
        expect(screen.getByText("Type:")).toBeInTheDocument();
        expect(screen.getByText("Soup")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Learn more" }),
        ).toHaveAttribute("href", "/recipe/1");
    });
});
