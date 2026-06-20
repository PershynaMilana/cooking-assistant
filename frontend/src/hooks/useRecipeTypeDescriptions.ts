import { useEffect, useState } from "react";

import { logger } from "config/logger";
import type { RecipeTypeSummary } from "types/recipeType";

import { getRecipeTypes } from "api/recipeTypesApi";

export const useRecipeTypeDescriptions = (selectedTypes: number[]) => {
    const [typesDescriptions, setTypesDescriptions] = useState<
        RecipeTypeSummary[]
    >([]);

    useEffect(() => {
        const fetchTypesDescriptions = async () => {
            try {
                if (selectedTypes.length > 0) {
                    const data = await getRecipeTypes({
                        ids: selectedTypes.join(","),
                    });

                    setTypesDescriptions(data);
                } else {
                    setTypesDescriptions((prev) =>
                        prev.length === 0 ? prev : [],
                    );
                }
            } catch (err) {
                logger.error("Error fetching recipe type descriptions.", err);
            }
        };

        void fetchTypesDescriptions();
    }, [selectedTypes]);

    const descriptions = typesDescriptions.filter((type) =>
        selectedTypes.includes(type.id),
    );

    const typesHeader = descriptions.map((type) => type.type_name).join(", ");

    return { descriptions, typesHeader };
};
