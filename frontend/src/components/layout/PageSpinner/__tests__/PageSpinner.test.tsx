import { render, screen } from "@testing-library/react";

import { PageSpinner } from "components/layout/PageSpinner";

describe("PageSpinner", () => {
    it("should render a centered spinner element", () => {
        render(<PageSpinner />);

        expect(screen.getByRole("status")).toBeInTheDocument();
    });
});
