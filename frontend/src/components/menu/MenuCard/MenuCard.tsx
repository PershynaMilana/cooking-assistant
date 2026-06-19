import React from "react";
import { useTranslation } from "react-i18next";

import { menuDetailsPath } from "constants/routes";

import { Card, CardMetaRow } from "components/ui/Card";

interface MenuCardProps {
    id: number;
    title: string;
    content: string;
    categoryName: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
    id,
    title,
    content,
    categoryName,
}) => {
    const { t } = useTranslation("menu");

    return (
        <Card
            title={title}
            to={menuDetailsPath(id)}
            actionLabel={t("menuCard.learnMore")}
        >
            <CardMetaRow label={t("menuCard.category")} value={categoryName} />
            <div className="text-sm font-montserratRegular text-gray-700 mt-2">
                {content}
            </div>
        </Card>
    );
};
