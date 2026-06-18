import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { MenuDetailRecipe, MenuDetails } from "types/menu";

import { getApiErrorMessage } from "api/httpError";
import { deleteMenu as deleteMenuApi, getMenuById } from "api/menusApi";

import { Header } from "components/layout/Header";
import RecipeCard from "components/RecipeCard";
import { Modal } from "components/ui/Modal";

import { getCurrentUserId } from "utils/getCurrentUserId";

// null on a missing token (via the shared util) or on a malformed token (caught here)
const getUserIdSafe = (): number | null => {
    try {
        return getCurrentUserId();
    } catch (error) {
        console.error("Error decoding token:", error);

        return null;
    }
};

const MenuDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [menu, setMenu] = useState<MenuDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const navigate = useNavigate();

    // function to fetch menu details
    const fetchMenuDetails = useCallback(async () => {
        if (!id) return;
        try {
            const data = await getMenuById(id);

            setMenu(data);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }, [id]);

    useEffect(() => {
        const userId = getUserIdSafe();

        setCurrentUserId(userId);
        void fetchMenuDetails();
    }, [fetchMenuDetails]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!menu) {
        return <div>Loading...</div>;
    }

    // handlers for modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        void deleteMenu();
        handleCloseModal();
    };

    // group recipes by type
    const groupedRecipes = menu.recipes.reduce(
        (groups: Record<string, MenuDetailRecipe[]>, recipe) => {
            const { type_name } = recipe;

            if (!(type_name in groups)) {
                groups[type_name] = [];
            }
            groups[type_name].push(recipe);

            return groups;
        },
        {},
    );

    // delete menu
    const deleteMenu = async () => {
        try {
            await deleteMenuApi(menu.menu.id);
            navigate("/menu");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    };

    // calculate missing ingredients
    const getAllMissingIngredients = () => {
        return menu.recipes
            .flatMap((recipe) => recipe.missingIngredients ?? [])
            .reduce(
                (
                    acc: Record<string, { quantity: number; unit: string }>,
                    ingredient,
                ) => {
                    const { ingredient_name, missing_quantity, unit_name } =
                        ingredient;

                    if (!(ingredient_name in acc)) {
                        acc[ingredient_name] = {
                            quantity: missing_quantity,
                            unit: unit_name,
                        };
                    } else {
                        acc[ingredient_name].quantity += missing_quantity;
                    }

                    return acc;
                },
                {},
            );
    };

    const missingIngredients = getAllMissingIngredients();

    const isOwner = menu.menu.personid === currentUserId;

    return (
        <div>
            <Header />
            <div className="mx-[15vw] mb-[5vh]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {menu.menu.title}
                </h1>
                <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
                    <strong>Menu category:</strong>{" "}
                </p>
                <p className="text-relative-ps font-montserratRegular">
                    {menu.menu.categoryname}
                </p>

                {/* Menu description */}
                <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
                    <strong>Menu description:</strong>{" "}
                </p>
                <p className="text-relative-ps font-montserratRegular">
                    {menu.menu.menucontent}
                </p>

                {/* Recipes */}
                <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold ">
                    <strong>Recipes:</strong>{" "}
                </p>

                {Object.keys(groupedRecipes).map((type) => (
                    <div key={type}>
                        <h2 className="text-xs-pxl font-monsterratRegular italic font-normal mt-4 mb-2">
                            {type}:
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            {groupedRecipes[type].map((recipe) => (
                                <RecipeCard
                                    key={recipe.recipe_id}
                                    id={recipe.recipe_id}
                                    title={recipe.title}
                                    typeName={recipe.type_name}
                                    cookingTime={recipe.cooking_time}
                                    creationDate={recipe.creation_date}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Missing ingredients */}
                <strong>Missing ingredients:</strong>
                <ul>
                    {Object.entries(missingIngredients).map(
                        ([ingredient, data]) => (
                            <li key={ingredient} className="text-relative-ps">
                                {ingredient}: {data.quantity} {data.unit}
                            </li>
                        ),
                    )}
                </ul>

                {/* Owner actions */}
                {isOwner && (
                    <>
                        <Link to={`/change-menu/${menu.menu.id}`}>
                            <button className="mt-6 mr-[1vw] bg-yellow-500 text-white py-2 px-4 rounded-full">
                                Edit menu
                            </button>
                        </Link>
                        <button
                            onClick={handleOpenModal}
                            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
                        >
                            Delete menu
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this menu?"
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default MenuDetailsPage;
