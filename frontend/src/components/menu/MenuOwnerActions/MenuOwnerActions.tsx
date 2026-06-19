import React from "react";
import { useTranslation } from "react-i18next";

import { changeMenuPath } from "constants/routes";

import { OwnerActions } from "components/ui/OwnerActions";

interface MenuOwnerActionsProps {
    menuId: number;
    onDelete: () => void;
}

export const MenuOwnerActions: React.FC<MenuOwnerActionsProps> = ({
    menuId,
    onDelete,
}) => {
    const { t } = useTranslation("menu");

    return (
        <OwnerActions
            editTo={changeMenuPath(menuId)}
            onDelete={onDelete}
            editLabel={t("menuDetailsPage.editButton")}
            deleteLabel={t("menuDetailsPage.deleteButton")}
        />
    );
};
