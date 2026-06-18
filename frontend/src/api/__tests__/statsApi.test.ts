import type { RecipesStatsResponse } from "types/stats";

import { API_ROUTES } from "api/endpoints";
import { getRecipesStats } from "api/statsApi";

import { mockedGet } from "test/apiClientMock";

jest.mock("../client");

const SAMPLE_STATS: RecipesStatsResponse = {
    averageCookingTimes: [{ typeName: "Soup", averageCookingTime: "30" }],
};

describe("statsApi", () => {
    it("should get the recipes stats and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_STATS });

        const result = await getRecipesStats();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipes.stats);
        expect(result).toEqual(SAMPLE_STATS);
    });
});
