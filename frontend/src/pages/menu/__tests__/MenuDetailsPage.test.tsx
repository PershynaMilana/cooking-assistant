import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MenuDetailsPage from "../MenuDetailsPage";
import { getMenuById } from "../../../api/menusApi";
import type { MenuDetails } from "../../../types/menu";

jest.mock("../../../api/menusApi");

const TITLE = "Weekday menu";
const SAMPLE: MenuDetails = {
    menu: { id: 1, title: TITLE, categoryname: "Lunch", menucontent: "quick" },
    recipes: [],
};

describe("MenuDetailsPage", () => {
    it("should render the menu title loaded from the api", async () => {
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);

        render(
            <MemoryRouter initialEntries={["/menu/1"]}>
                <Routes>
                    <Route path="/menu/:id" element={<MenuDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
