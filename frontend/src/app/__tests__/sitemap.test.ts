import { fetchPublic } from "api/server";

import sitemap from "app/sitemap";

jest.mock("api/server", () => ({ fetchPublic: jest.fn() }));

const mockedFetch = fetchPublic as jest.MockedFunction<typeof fetchPublic>;

const page = (ids: number[], total: number) => ({
    items: ids.map((id) => ({ id })),
    total,
});

// the two lists are fetched in parallel, so the mock answers by endpoint rather than by call order
const respondWith = (
    byEndpoint: Record<string, ReturnType<typeof page> | null>,
) => {
    mockedFetch.mockImplementation((path: string) => {
        const [endpoint = ""] = path.split("?");

        return Promise.resolve(byEndpoint[endpoint] ?? page([], 0));
    });
};

const urls = async (): Promise<string[]> =>
    (await sitemap()).map((entry) => entry.url);

describe("sitemap", () => {
    it("should list the browse pages and every public recipe and menu", async () => {
        respondWith({
            "/api/recipes-by-filters": page([1, 2], 2),
            "/api/menu": page([3], 1),
        });

        await expect(urls()).resolves.toEqual([
            "http://localhost:8080/",
            "http://localhost:8080/all-recipes",
            "http://localhost:8080/all-menus",
            "http://localhost:8080/recipe/1",
            "http://localhost:8080/recipe/2",
            "http://localhost:8080/menu/3",
        ]);
    });

    it("should walk past the api's page limit rather than stop at the first page", async () => {
        const ids = Array.from({ length: 100 }, (_item, index) => index + 1);

        mockedFetch.mockImplementation((path: string) => {
            if (!path.startsWith("/api/recipes-by-filters")) {
                return Promise.resolve(page([], 0));
            }

            return Promise.resolve(
                path.includes("offset=0") ? page(ids, 101) : page([101], 101),
            );
        });

        await expect(urls()).resolves.toContain(
            "http://localhost:8080/recipe/101",
        );
    });

    it("should stop when the api answers with nothing", async () => {
        mockedFetch.mockResolvedValue(null);

        await expect(urls()).resolves.toHaveLength(3);
    });
});
