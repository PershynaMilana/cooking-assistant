-- Up Migration

CREATE INDEX idx_recipes_person_id ON recipes (person_id);
CREATE INDEX idx_recipes_type_id ON recipes (type_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients (ingredient_id);
CREATE INDEX idx_menu_person_id ON menu (person_id);
CREATE INDEX idx_menu_recipe_menu_id ON menu_recipe (menu_id);
CREATE INDEX idx_menu_recipe_recipe_id ON menu_recipe (recipe_id);
CREATE INDEX idx_ingredient_purchases_person_ingredient ON ingredient_purchases (person_id, ingredient_id);

-- Down Migration

DROP INDEX idx_ingredient_purchases_person_ingredient;
DROP INDEX idx_menu_recipe_recipe_id;
DROP INDEX idx_menu_recipe_menu_id;
DROP INDEX idx_menu_person_id;
DROP INDEX idx_recipe_ingredients_ingredient_id;
DROP INDEX idx_recipes_type_id;
DROP INDEX idx_recipes_person_id;
