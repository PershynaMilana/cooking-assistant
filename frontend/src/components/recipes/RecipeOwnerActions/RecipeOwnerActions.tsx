import React from "react";
import { useTranslation } from "react-i18next";

import { changeRecipePath } from "constants/routes";

import { OwnerActions } from "components/ui/OwnerActions";

interface RecipeOwnerActionsProps {
    recipeId: number;
    onDelete: () => void;
}

export const RecipeOwnerActions: React.FC<RecipeOwnerActionsProps> = ({
    recipeId,
    onDelete,
}) => {
    const { t } = useTranslation("recipes");

    return (
        <OwnerActions
            editTo={changeRecipePath(recipeId)}
            onDelete={onDelete}
            editLabel={t("recipeDetailsPage.editButton")}
            deleteLabel={t("recipeDetailsPage.deleteButton")}
        />
    );
};
