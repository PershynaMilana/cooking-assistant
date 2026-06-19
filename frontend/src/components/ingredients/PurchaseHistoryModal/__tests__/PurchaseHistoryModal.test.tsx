import { screen } from "@testing-library/react";

import type { Purchase } from "types/userIngredient";

import { getPurchaseHistory } from "api/userIngredientsApi";

import { PurchaseHistoryModal } from "components/ingredients/PurchaseHistoryModal";

import { mockJwtUser, setAuthToken } from "test/auth";
import { renderWithRouter } from "test/router";

jest.mock("api/userIngredientsApi");
jest.mock("jwt-decode");

const SAMPLE_HISTORY: Purchase[] = [
    {
        id: 1,
        quantity: 500,
        purchase_date: "2025-01-01T00:00:00.000Z",
        unit_name: "g",
        days_to_expire: 365,
    },
];

describe("PurchaseHistoryModal", () => {
    it("should render purchase history loaded from the api", async () => {
        setAuthToken();
        mockJwtUser(1);
        jest.mocked(getPurchaseHistory).mockResolvedValue(SAMPLE_HISTORY);

        renderWithRouter(
            <PurchaseHistoryModal
                ingredientId={5}
                ingredientName="Potato"
                onClose={jest.fn()}
            />,
        );

        expect(
            await screen.findByText("Purchase History: Potato"),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Close" }),
        ).toBeInTheDocument();
    });
});
