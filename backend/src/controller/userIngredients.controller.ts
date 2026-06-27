import type { RequestHandler } from "express";

import { SUCCESS_MESSAGES } from "constants/errorMessages";

import type AddUserIngredients from "application/use-cases/pantry/AddUserIngredients";
import type DeleteUserIngredient from "application/use-cases/pantry/DeleteUserIngredient";
import type GetPurchaseHistory from "application/use-cases/pantry/GetPurchaseHistory";
import type GetUserIngredients from "application/use-cases/pantry/GetUserIngredients";
import type UpdateIngredientQuantities from "application/use-cases/pantry/UpdateIngredientQuantities";
import type UpdatePurchaseQuantity from "application/use-cases/pantry/UpdatePurchaseQuantity";

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
        const { ingredients } = req.body as Record<string, unknown>;

        await this.addUserIngredientsUseCase.execute(userId, ingredients);

        res.status(200).json({
            message: SUCCESS_MESSAGES.INGREDIENTS_UPDATED,
        });
    };

    deleteUserIngredient: RequestHandler<{ ingredientId: string }> = async (
        req,
        res,
    ) => {
        const userId = getUserId(req);

        await this.deleteUserIngredientUseCase.execute(
            userId,
            req.params.ingredientId,
        );

        res.json({
            message: SUCCESS_MESSAGES.INGREDIENT_DELETED,
        });
    };

    updateIngredientQuantities: RequestHandler = async (req, res) => {
        const userId = getUserId(req);
        const { updatedIngredients } = req.body as Record<string, unknown>;

        await this.updateIngredientQuantitiesUseCase.execute(
            userId,
            updatedIngredients,
        );

        res.json({
            message: SUCCESS_MESSAGES.QUANTITIES_UPDATED,
        });
    };

    updatePurchaseQuantity: RequestHandler<{ purchaseId: string }> = async (
        req,
        res,
    ) => {
        const userId = getUserId(req);
        const { quantity } = req.body as Record<string, unknown>;

        await this.updatePurchaseQuantityUseCase.execute(
            userId,
            req.params.purchaseId,
            quantity,
        );

        res.status(200).json({
            message: SUCCESS_MESSAGES.PURCHASE_UPDATED,
        });
    };

    getPurchaseHistory: RequestHandler<{ ingredientId: string }> = async (
        req,
        res,
    ) => {
        const userId = getUserId(req);
        const history = await this.getPurchaseHistoryUseCase.execute(
            userId,
            req.params.ingredientId,
        );

        res.json(history);
    };
}
