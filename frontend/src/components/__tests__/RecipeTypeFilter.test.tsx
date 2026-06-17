import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeTypeFilter from "../RecipeTypeFilter";
import { getRecipeTypes } from "../../api/recipeTypesApi";

jest.mock("../../api/recipeTypesApi");

const TYPE_ID = 2;
const TYPE_NAME = "Soup";

describe("RecipeTypeFilter", () => {
    it("should load types and call onChange when a type is selected", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([
            { id: TYPE_ID, type_name: TYPE_NAME, description: "" },
        ]);
        const onChange = jest.fn();

        render(<RecipeTypeFilter selectedTypes={[]} onChange={onChange} />);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(await screen.findByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith([TYPE_ID]);
    });
});
