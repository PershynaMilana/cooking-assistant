const { ValidationError } = require("../errors/AppError");

function validateIngredients(ingredients) {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new ValidationError("Ingredients cannot be empty");
    }

    for (const ingredient of ingredients) {
        if (!ingredient.id) {
            throw new ValidationError("All ingredients must have id");
        }
    }
}

class Recipe {
    static forCreation({
        title,
        content,
        person_id,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }) {
        validateIngredients(ingredients);

        return new Recipe({
            title,
            content,
            person_id,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });
    }

    static forUpdate({
        title,
        content,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }) {
        if (!title || !content) {
            throw new ValidationError("Title and content cannot be empty");
        }

        validateIngredients(ingredients);

        return new Recipe({
            title,
            content,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });
    }

    constructor(data) {
        Object.assign(this, data);
    }
}

module.exports = Recipe;
