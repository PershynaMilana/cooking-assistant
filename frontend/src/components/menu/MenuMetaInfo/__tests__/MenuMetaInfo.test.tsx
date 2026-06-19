import { render, screen } from "@testing-library/react";

import { MenuMetaInfo } from "components/menu/MenuMetaInfo";

describe("MenuMetaInfo", () => {
    it("should render the category and content under their labels", () => {
        render(<MenuMetaInfo categoryName="Lunch" content="Quick meals" />);

        expect(screen.getByText("Menu category:")).toBeInTheDocument();
        expect(screen.getByText("Lunch")).toBeInTheDocument();
        expect(screen.getByText("Menu description:")).toBeInTheDocument();
        expect(screen.getByText("Quick meals")).toBeInTheDocument();
    });
});
