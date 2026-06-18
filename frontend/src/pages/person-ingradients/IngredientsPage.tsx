import React, { useEffect, useState } from "react";

import type { PantryIngredient as Ingredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
    updateQuantities,
} from "api/userIngredientsApi";

import { Header } from "components/layout/Header";
import PurchaseHistoryModal from "components/PurchaseHistoryModal";

import { getCurrentUserId } from "utils/getCurrentUserId";

const NO_AUTH_TOKEN = "No auth token found.";

interface AllIngredient {
    id: number;
    name: string;
}

const IngredientsPage: React.FC = () => {
    const [allIngredients, setAllIngredients] = useState<AllIngredient[]>([]);
    const [personIngredients, setPersonIngredients] = useState<Ingredient[]>(
        [],
    );
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>(
        [],
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIngredientToDelete, setSelectedIngredientToDelete] =
        useState<Ingredient | null>(null);
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);
    const [updatedIngredients, setUpdatedIngredients] = useState<Ingredient[]>(
        [],
    );
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedHistoryIngredient, setSelectedHistoryIngredient] =
        useState<Ingredient | null>(null);

    const openHistoryModal = (ingredient: Ingredient) => {
        setSelectedHistoryIngredient(ingredient);
        setIsHistoryModalOpen(true);
    };

    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedHistoryIngredient(null);
        void fetchSelectedIngredients();
    };

    useEffect(() => {
        const fetchIngredients = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                console.error(NO_AUTH_TOKEN);

                return;
            }

            try {
                const ingredients = await getIngredients();
                const sortedIngredients = ingredients.sort((a, b) =>
                    a.name.localeCompare(b.name),
                );

                setAllIngredients(sortedIngredients);
            } catch (error) {
                console.error("Error loading ingredients:", error);
            }
        };

        void fetchIngredients();
    }, []);

    const fetchSelectedIngredients = async () => {
        const userId = getCurrentUserId();

        if (userId === null) {
            console.error(NO_AUTH_TOKEN);

            return;
        }

        try {
            const data = await getUserIngredients(userId);

            setPersonIngredients(
                data.map((item) => ({
                    ...item,
                    id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    allergens: item.allergens,
                    purchase_date: item.purchase_date,
                })),
            );

            setSelectedIngredients(
                data.map((ingredient) => ingredient.ingredient_id),
            );
        } catch (error) {
            console.error("Error loading selected ingredients:", error);
        }
    };

    useEffect(() => {
        void fetchSelectedIngredients();
    }, []);

    const toggleIngredientSelection = (ingredientId: number) => {
        setSelectedIngredients((prev) =>
            prev.includes(ingredientId)
                ? prev.filter((id) => id !== ingredientId)
                : [...prev, ingredientId],
        );
    };

    const saveIngredients = async () => {
        const userId = getCurrentUserId();

        if (userId === null) {
            console.error(NO_AUTH_TOKEN);

            return;
        }

        const newIngredients = allIngredients
            .filter(
                (ingredient) =>
                    selectedIngredients.includes(ingredient.id) &&
                    !personIngredients.some(
                        (item) => item.id === ingredient.id,
                    ),
            )
            .map((ingredient) => ({
                id: ingredient.id,
                ingredient_name: ingredient.name,
                quantity_person_ingradient: 1,
            }));

        try {
            await saveUserIngredient(userId, { ingredients: newIngredients });

            setIsEditing(false);
            await fetchSelectedIngredients();
        } catch (error) {
            console.error("Error saving ingredients:", error);
        }
    };

    const toggleQuantityEdit = () => {
        setIsEditingQuantity((prev) => !prev);
        setIsEditing(false);
        setUpdatedIngredients([...personIngredients]);
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        const today = new Date().toISOString().split("T")[0];

        setUpdatedIngredients((prev) =>
            prev.map((ingredient) =>
                ingredient.id === id
                    ? {
                          ...ingredient,
                          quantity_person_ingradient:
                              newQuantity >
                              ingredient.quantity_person_ingradient
                                  ? newQuantity
                                  : ingredient.quantity_person_ingradient,
                          purchase_date: today,
                      }
                    : ingredient,
            ),
        );
    };

    const saveUpdatedQuantities = async () => {
        const userId = getCurrentUserId();

        if (userId === null) {
            console.error(NO_AUTH_TOKEN);

            return;
        }

        const changedIngredients = updatedIngredients.filter(
            (updatedIngredient) => {
                const original = personIngredients.find(
                    (ingredient) => ingredient.id === updatedIngredient.id,
                );

                return (
                    original &&
                    original.quantity_person_ingradient !==
                        updatedIngredient.quantity_person_ingradient
                );
            },
        );

        if (changedIngredients.length === 0) {
            console.log("No changes to save.");

            return;
        }

        try {
            await updateQuantities(userId, {
                updatedIngredients: changedIngredients,
            });

            setIsEditingQuantity(false);
            await fetchSelectedIngredients();
        } catch (error) {
            console.error("Error saving ingredient quantities:", error);
        }
    };

    const confirmDeleteIngredient = (ingredient: Ingredient) => {
        if (!ingredient.id) {
            console.error("Ingredient ID is missing:", ingredient);

            return;
        }
        setSelectedIngredientToDelete(ingredient);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const userId = getCurrentUserId();

        if (userId === null || !selectedIngredientToDelete) {
            console.error("No auth token found or ingredient not selected.");

            return;
        }

        try {
            await deleteUserIngredient(userId, selectedIngredientToDelete.id);

            setPersonIngredients((prev) =>
                prev.filter(
                    (item) => item.id !== selectedIngredientToDelete.id,
                ),
            );
            setSelectedIngredients((prev) =>
                prev.filter((id) => id !== selectedIngredientToDelete.id),
            );

            console.log("Ingredient and history successfully deleted.");
        } catch (error) {
            console.error("Error deleting ingredient and history:", error);
        }

        setIsModalOpen(false);
        setSelectedIngredientToDelete(null);
    };

    const isIngredientExpired = (ingredient: Ingredient): boolean => {
        if (!ingredient.purchase_date || !ingredient.days_to_expire) {
            return false;
        }

        const purchaseDate = new Date(ingredient.purchase_date);
        const today = new Date();

        const expirationDate = new Date(purchaseDate);

        expirationDate.setDate(
            purchaseDate.getDate() + ingredient.days_to_expire,
        );

        return today >= expirationDate;
    };

    return (
        <div>
            <Header />
            <div className="w-11/12 mx-auto">
                <h1 className="text-3xl font-bold mb-6 justify-self-center m-4">
                    My Ingredients
                </h1>

                {/* Display current ingredients */}
                {!isEditingQuantity &&
                    (!isEditing ? (
                        <ul className="space-y-2">
                            {personIngredients.length === 0 ? (
                                <p className="text-center text-gray-600 mb-4">
                                    You currently have no ingredients.
                                </p>
                            ) : (
                                personIngredients.map((ingredient, index) => (
                                    <li
                                        key={ingredient.id || index}
                                        className={`rounded p-2 flex justify-between items-center ${
                                            isIngredientExpired(ingredient)
                                                ? "bg-red-300"
                                                : "bg-blue-200"
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                            <span className="font-medium">
                                                {ingredient.ingredient_name}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {
                                                    ingredient.quantity_person_ingradient
                                                }{" "}
                                                - {ingredient.unit_name}
                                            </span>
                                            <span className="ml-2 text-sm text-black">
                                                Allergens:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {ingredient.allergens}.
                                            </span>
                                            <span className="ml-2 text-sm text-black">
                                                Shelf life:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {ingredient.days_to_expire
                                                    ? `${ingredient.days_to_expire} days.`
                                                    : "No expiration."}
                                            </span>
                                            <span className="ml-2 text-sm text-black">
                                                Storage conditions:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {ingredient.storage_condition}.
                                            </span>
                                            <span className="ml-2 text-sm text-black">
                                                Season:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {ingredient.seasonality}.
                                            </span>
                                            <span className="ml-2 text-sm text-black">
                                                Purchase date:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {ingredient.purchase_date
                                                    ? new Date(
                                                          ingredient.purchase_date,
                                                      ).toLocaleDateString()
                                                    : "Unknown"}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 ml-auto">
                                            <button
                                                onClick={() => {
                                                    openHistoryModal(
                                                        ingredient,
                                                    );
                                                }}
                                                className="bg-amber-500 text-white py-2 px-4 rounded-full"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    confirmDeleteIngredient(
                                                        ingredient,
                                                    );
                                                }}
                                                className="bg-red-500 text-white py-2 px-4 rounded-full"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    ) : (
                        // new ingredient selection mode
                        <div className="flex flex-wrap gap-2 mt-4">
                            {allIngredients
                                .filter(
                                    (ingredient) =>
                                        !personIngredients.some(
                                            (existingIngredient) =>
                                                existingIngredient.id ===
                                                ingredient.id,
                                        ),
                                )
                                .map((ingredient) => (
                                    <button
                                        key={ingredient.id}
                                        type="button"
                                        onClick={() => {
                                            toggleIngredientSelection(
                                                ingredient.id,
                                            );
                                        }}
                                        className={`py-2 px-4 rounded-full ${
                                            selectedIngredients.includes(
                                                ingredient.id,
                                            )
                                                ? "bg-blue-700 text-white"
                                                : "bg-gray-300 text-black"
                                        }`}
                                    >
                                        {ingredient.name}
                                    </button>
                                ))}
                        </div>
                    ))}

                {/* Edit quantity mode */}
                {isEditingQuantity && (
                    <div>
                        {updatedIngredients.map((ingredient) => (
                            <div
                                key={ingredient.id}
                                className="flex items-center justify-between mb-2"
                            >
                                <span className="font-medium">
                                    {ingredient.ingredient_name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            ingredient.quantity_person_ingradient
                                        }
                                        onChange={(e) => {
                                            handleQuantityChange(
                                                ingredient.id,
                                                +e.target.value,
                                            );
                                        }}
                                        className="border border-gray-300 rounded p-1 w-20 text-center"
                                    />
                                    <span className="text-gray-700">
                                        {ingredient.unit_name}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                void saveUpdatedQuantities();
                            }}
                            className="bg-green-500 text-white py-2 px-4 rounded-full mt-4 block mx-auto"
                        >
                            Save quantities
                        </button>
                    </div>
                )}

                {/* Main buttons */}
                {!isEditingQuantity && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    void saveIngredients();
                                }
                                setIsEditing((prev) => !prev);
                            }}
                            className="bg-green-500 text-white py-2 px-4 rounded-full"
                        >
                            {isEditing ? "Save" : "Edit ingredients"}
                        </button>
                        {!isEditing && (
                            <button
                                onClick={toggleQuantityEdit}
                                className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                            >
                                Edit quantities
                            </button>
                        )}
                    </div>
                )}

                {/* Modal confirmation */}
                {isModalOpen && selectedIngredientToDelete && (
                    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="mb-4 text-center">
                                Are you sure you want to delete the ingredient "
                                {selectedIngredientToDelete.ingredient_name}"?
                            </p>

                            <div className="flex justify-center space-x-2">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-full"
                                    onClick={() => {
                                        void handleDeleteConfirm();
                                    }}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded-full"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PurchaseHistoryModal */}
            {isHistoryModalOpen && selectedHistoryIngredient && (
                <PurchaseHistoryModal
                    ingredientId={selectedHistoryIngredient.id}
                    ingredientName={
                        selectedHistoryIngredient.ingredient_name ?? ""
                    }
                    onClose={closeHistoryModal}
                />
            )}
        </div>
    );
};

export default IngredientsPage;
