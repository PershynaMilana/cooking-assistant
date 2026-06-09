class GetPurchaseHistory {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId, ingredientId) {
        return this.pantryRepository.findPurchaseHistory(userId, ingredientId);
    }
}

module.exports = GetPurchaseHistory;
