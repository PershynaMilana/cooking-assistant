// port: contract every pantry repository must implement
class PantryRepository {
    async findByUser(_userId) {
        throw new Error("not implemented");
    }

    async addIngredients(_userId, _items) {
        throw new Error("not implemented");
    }

    async deleteIngredient(_userId, _ingredientId) {
        throw new Error("not implemented");
    }

    async updateQuantities(_userId, _items) {
        throw new Error("not implemented");
    }

    async updatePurchaseQuantity(_userId, _purchaseId, _quantity) {
        throw new Error("not implemented");
    }

    async findPurchaseHistory(_userId, _ingredientId) {
        throw new Error("not implemented");
    }
}

module.exports = PantryRepository;
