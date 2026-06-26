import { buildMenuFilterParams } from "utils/menuFilterParams";

describe("buildMenuFilterParams", () => {
    it("should build params with an empty name and no categories when none are set", () => {
        expect(buildMenuFilterParams([], null)).toEqual({
            menu_name: "",
            category_ids: undefined,
        });
    });

    it("should join selected category ids and pass the name through", () => {
        expect(buildMenuFilterParams([3, 4], "soup")).toEqual({
            menu_name: "soup",
            category_ids: "3,4",
        });
    });
});
