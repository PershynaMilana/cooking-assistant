import React from "react";

import type { MenuDetailRecipe } from "types/menu";

import { RecipeCard } from "components/recipes/RecipeCard";

interface GroupedRecipesListProps {
    groupedRecipes: Record<string, MenuDetailRecipe[]>;
}

export const GroupedRecipesList: React.FC<GroupedRecipesListProps> = ({
    groupedRecipes,
}) => (
    <>
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
    </>
);
