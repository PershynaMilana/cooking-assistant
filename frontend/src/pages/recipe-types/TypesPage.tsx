import React from "react";
import { useTranslation } from "react-i18next";

import { useGetRecipeTypesQuery } from "redux/services/recipeTypesApi";

import { Header } from "components/layout/Header";
import { TypeListItem } from "components/recipe-types/TypeListItem";

const TypesPage: React.FC = () => {
    const { t } = useTranslation("recipeTypes");
    const { data: types = [] } = useGetRecipeTypesQuery(null);

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("listPage.heading")}
                </h1>
                <ul>
                    {types.map((type) => (
                        <TypeListItem key={type.id} type={type} />
                    ))}
                </ul>
            </div>
        </>
    );
};

export default TypesPage;
