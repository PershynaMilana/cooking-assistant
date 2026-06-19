import React from "react";
import { useTranslation } from "react-i18next";

interface MenuMetaInfoProps {
    categoryName: string;
    content: string;
}

export const MenuMetaInfo: React.FC<MenuMetaInfoProps> = ({
    categoryName,
    content,
}) => {
    const { t } = useTranslation("menu");

    return (
        <>
            <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
                <strong>{t("menuDetailsPage.menuCategory")}</strong>
            </p>
            <p className="text-relative-ps font-montserratRegular">
                {categoryName}
            </p>

            <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
                <strong>{t("menuDetailsPage.menuDescription")}</strong>
            </p>
            <p className="text-relative-ps font-montserratRegular">{content}</p>
        </>
    );
};
