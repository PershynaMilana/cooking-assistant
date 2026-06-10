import type { RequestHandler } from "express";

import type AddUserIngredients from "../application/use-cases/pantry/AddUserIngredients";
import type DeleteUserIngredient from "../application/use-cases/pantry/DeleteUserIngredient";
import type GetPurchaseHistory from "../application/use-cases/pantry/GetPurchaseHistory";
import type GetUserIngredients from "../application/use-cases/pantry/GetUserIngredients";
import type UpdateIngredientQuantities from "../application/use-cases/pantry/UpdateIngredientQuantities";
import type UpdatePurchaseQuantity from "../application/use-cases/pantry/UpdatePurchaseQuantity";
import { getUserId } from "./requestUser";

interface UserIngredientsControllerDependencies {
    getUserIngredients: GetUserIngredients;
    addUserIngredients: AddUserIngredients;
    deleteUserIngredient: DeleteUserIngredient;
    updateIngredientQuantities: UpdateIngredientQuantities;
    updatePurchaseQuantity: UpdatePurchaseQuantity;
    getPurchaseHistory: GetPurchaseHistory;
}

export default class UserIngredientsController {
    private getUserIngredientsUseCase: GetUserIngredients;
    private addUserIngredientsUseCase: AddUserIngredients;
    private deleteUserIngredientUseCase: DeleteUserIngredient;
    private updateIngredientQuantitiesUseCase: UpdateIngredientQuantities;
    private updatePurchaseQuantityUseCase: UpdatePurchaseQuantity;
    private getPurchaseHistoryUseCase: GetPurchaseHistory;

    constructor({
        getUserIngredients,
        addUserIngredients,
        deleteUserIngredient,
        updateIngredientQuantities,
        updatePurchaseQuantity,
        getPurchaseHistory,
    }: UserIngredientsControllerDependencies) {
        this.getUserIngredientsUseCase = getUserIngredients;
        this.addUserIngredientsUseCase = addUserIngredients;
        this.deleteUserIngredientUseCase = deleteUserIngredient;
        this.updateIngredientQuantitiesUseCase = updateIngredientQuantities;
        this.updatePurchaseQuantityUseCase = updatePurchaseQuantity;
        this.getPurchaseHistoryUseCase = getPurchaseHistory;
    }

    getUserIngredients: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const ingredients =
            await this.getUserIngredientsUseCase.execute(userId);
        res.json(ingredients);
    };

    updateUserIngredients: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const { ingredients } = req.body;

        await this.addUserIngredientsUseCase.execute(userId, ingredients);

        res.status(200).json({
            message: "Ingredients updated successfully",
        });
    };

    deleteUserIngredient: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const ingredientId = req.params.ingredientId as string;

        await this.deleteUserIngredientUseCase.execute(userId, ingredientId);

        res.json({
            message: "Ingredient and its history successfully deleted",
        });
    };

    updateIngredientQuantities: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const { updatedIngredients } = req.body;

        await this.updateIngredientQuantitiesUseCase.execute(
            userId,
            updatedIngredients,
        );

        res.json({
            message: "Ingredient quantities and purchase history updated",
        });
    };

    updatePurchaseQuantity: RequestHandler = async (req, res) => {
        const purchaseId = req.params.purchaseId as string;
        const userId = getUserId(req);
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

    getPurchaseHistory: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const ingredientId = req.params.ingredientId as string;
        const history = await this.getPurchaseHistoryUseCase.execute(
            userId,
            ingredientId,
        );

        res.json(history);
    };
}
