import GetPurchaseHistory from "../GetPurchaseHistory";

describe("GetPurchaseHistory", () => {
    it("should return purchase history from the repository", async () => {
        const history = [{ id: 12, quantity: 3 }];
        const pantryRepository = {
            findPurchaseHistory: jest.fn().mockResolvedValue(history),
        };
        const useCase = new GetPurchaseHistory(pantryRepository);

        const result = await useCase.execute(7, 3);

        expect(pantryRepository.findPurchaseHistory).toHaveBeenCalledWith(7, 3);
        expect(result).toEqual(history);
    });
});
