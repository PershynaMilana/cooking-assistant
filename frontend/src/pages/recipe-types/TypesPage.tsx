import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { editRecipeTypePath, ROUTES } from "constants/routes";
import type { RecipeTypeSummary } from "types/recipeType";

import { deleteRecipeType } from "api/recipeTypesApi";

import { useRecipeTypes } from "hooks/useRecipeTypes";

import { Header } from "components/layout/Header";
import { TypeListItem } from "components/recipe-types/TypeListItem";
import { Modal } from "components/ui/Modal";

const TypesPage: React.FC = () => {
    const { t } = useTranslation("recipeTypes");
    const navigate = useNavigate();
    const { types, reload } = useRecipeTypes();
    const [selectedType, setSelectedType] = useState<RecipeTypeSummary | null>(
        null,
    );
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = async () => {
        if (!selectedType || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteRecipeType(selectedType.id);
            setSelectedType(null);
            setDeleteError(null);
            await reload();
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : t("listPage.deleteError"),
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("listPage.heading")}
                </h1>
                <Link
                    to={ROUTES.addRecipeType}
                    className="font-montserratRegular text-l"
                >
                    <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
                        {t("listPage.addButton")}
                    </button>
                </Link>
                <ul>
                    {types.map((type) => (
                        <TypeListItem
                            key={type.id}
                            type={type}
                            onEdit={() => {
                                navigate(editRecipeTypePath(type.id));
                            }}
                            onDelete={() => {
                                setDeleteError(null);
                                setSelectedType(type);
                            }}
                            editLabel={t("listPage.editButton")}
                            deleteLabel={t("listPage.deleteButton")}
                        />
                    ))}
                </ul>
            </div>

            <Modal
                isOpen={selectedType !== null}
                title={t("listPage.deleteTitle")}
                message={t("listPage.deleteMessage", {
                    name: selectedType?.type_name ?? "",
                })}
                onClose={() => {
                    setDeleteError(null);
                    setSelectedType(null);
                }}
                onConfirm={() => {
                    void handleDeleteConfirm();
                }}
                error={deleteError}
                isConfirmDisabled={isDeleting}
            />
        </>
    );
};

export default TypesPage;
