class UserIngredientsController {
    constructor({
        getUserIngredients,
        addUserIngredients,
        deleteUserIngredient,
        updateIngredientQuantities,
        updatePurchaseQuantity,
        getPurchaseHistory,
    }) {
        this.getUserIngredientsUseCase = getUserIngredients;
        this.addUserIngredientsUseCase = addUserIngredients;
        this.deleteUserIngredientUseCase = deleteUserIngredient;
        this.updateIngredientQuantitiesUseCase = updateIngredientQuantities;
        this.updatePurchaseQuantityUseCase = updatePurchaseQuantity;
        this.getPurchaseHistoryUseCase = getPurchaseHistory;
    }

    getUserIngredients = async (req, res) => {
        const userId = req.user.id;
        const ingredients =
            await this.getUserIngredientsUseCase.execute(userId);
        res.json(ingredients);
    };

    updateUserIngredients = async (req, res) => {
        const userId = req.user.id;
        const { ingredients } = req.body;

        await this.addUserIngredientsUseCase.execute(userId, ingredients);

        res.status(200).json({
            message: "Ingredients updated successfully",
        });
    };

    deleteUserIngredient = async (req, res) => {
        const userId = req.user.id;
        const ingredientId = req.params.ingredientId;

        await this.deleteUserIngredientUseCase.execute(userId, ingredientId);

        res.json({
            message: "Ingredient and its history successfully deleted",
        });
    };

    updateIngredientQuantities = async (req, res) => {
        const userId = req.user.id;
        const { updatedIngredients } = req.body;

        await this.updateIngredientQuantitiesUseCase.execute(
            userId,
            updatedIngredients,
        );

        res.json({
            message: "Ingredient quantities and purchase history updated",
        });
    };

    updatePurchaseQuantity = async (req, res) => {
        const { purchaseId } = req.params;
        const userId = req.user.id;
        const { quantity } = req.body;

        await this.updatePurchaseQuantityUseCase.execute(
            userId,
            purchaseId,
            quantity,
        );

        res.status(200).json({
            message: "Purchase quantity updated successfully.",
        });
    };

    getPurchaseHistory = async (req, res) => {
        const userId = req.user.id;
        const ingredientId = req.params.ingredientId;
        const history = await this.getPurchaseHistoryUseCase.execute(
            userId,
            ingredientId,
        );

        res.json(history);
    };
}

module.exports = UserIngredientsController;
