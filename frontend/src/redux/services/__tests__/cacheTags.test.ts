import { listProvidesTags } from "redux/services/cacheTags";

describe("listProvidesTags", () => {
    it("should tag every row by id plus a shared LIST tag", () => {
        const tags = listProvidesTags("Recipe", [{ id: 1 }, { id: 2 }]);

        expect(tags).toEqual([
            { type: "Recipe", id: 1 },
            { type: "Recipe", id: 2 },
            { type: "Recipe", id: "LIST" },
        ]);
    });

    it("should fall back to only the LIST tag when there is no result", () => {
        expect(listProvidesTags("Recipe", undefined)).toEqual([
            { type: "Recipe", id: "LIST" },
        ]);
    });
});
