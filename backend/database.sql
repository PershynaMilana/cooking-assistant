CREATE TABLE
    person (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        surname VARCHAR(255),
        login VARCHAR(255),
        password VARCHAR(255)
    );

CREATE TABLE
    ingredients (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);

CREATE TABLE
    recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        person_id INTEGER NOT NULL,
        FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE
    );

CREATE TABLE
    recipe_ingredients (
        recipe_id INTEGER,
        ingredient_id INTEGER,
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
    );

CREATE TABLE
    recipe_types (
        id SERIAL PRIMARY KEY,
        type_name VARCHAR(255) NOT NULL,
        description TEXT
    );

ALTER TABLE recipes
ADD COLUMN type_id INTEGER,
ADD FOREIGN KEY (type_id) REFERENCES recipe_types (id) ON DELETE SET NULL;

INSERT INTO
    recipe_types (type_name, description)
VALUES
    (
        'First course',
        '"First course" includes various soups, broths, and light appetizers that not only warm the soul but also stimulate the appetite.'
    ),
    (
        'Main course',
        'The Main course is the foundation of a hearty meal. These are meat, fish, or vegetable dishes that provide energy and a feeling of satisfaction after eating.'
    ),
    (
        'Dessert',
        'Dessert is the sweet finale of a culinary journey. Cakes, pies, pastries, and other treats create unforgettable moments of pleasure for all sweet lovers.'
    ),
    (
        'Drink',
        'Drinks are a complement to any dish. They can be hot, cold, refreshing, or invigorating, enhancing flavors and adding completeness to the meal.'
    );

INSERT INTO
    ingredients (name)
VALUES
    ('Potato'),
    ('Carrot'),
    ('Onion'),
    ('Tomato'),
    ('Cucumber'),
    ('Water'),
    ('Tea'),
    ('Lemon');

ALTER TABLE recipes
ADD COLUMN creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE recipes
ADD COLUMN cooking_time INTEGER;

INSERT INTO
    ingredients (name)
VALUES
    ('Basil'),
    ('Garlic'),
    ('Mushrooms'),
    ('Sour cream'),
    ('Chicken fillet'),
    ('Milk'),
    ('Honey'),
    ('Flour'),
    ('Sugar'),
    ('Rice');

CREATE TABLE
    person_ingredients (
        person_id INTEGER,
        ingredient_id INTEGER,
        PRIMARY KEY (person_id, ingredient_id),
        FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
    );

-- milka changes
ALTER TABLE person
ALTER COLUMN name
SET
    NOT NULL,
ALTER COLUMN surname
SET
    NOT NULL,
ALTER COLUMN login
SET
    NOT NULL,
ALTER COLUMN password
SET
    NOT NULL,
    ADD CONSTRAINT unique_login UNIQUE (login);

--! i lovvvveeee youuuu <3
-- !!!!! kuisanchik <3
-- Creating table for units of measurement
CREATE TABLE
    unit_measurement (
        id SERIAL PRIMARY KEY,
        unit_name VARCHAR(255) NOT NULL, -- Name of the unit
        coefficient DOUBLE PRECISION -- Conversion coefficient to grams, NULL if not applicable
    );

-- Filling unit_measurement table with basic units
INSERT INTO
    unit_measurement (unit_name, coefficient)
VALUES
    ('gr', 1),
    ('kg', 1000),
    ('ml', 1),
    ('l', 1000),
    ('teaspoon', 5),
    ('tablespoon', 15),
    ('cup', 250),
    ('pcs', NULL);

-- "Piece" without conversion to grams
-- Adding new field to ingredients to store id_unit_measurement
-- Default value 1 (grams)
ALTER TABLE ingredients
ADD COLUMN id_unit_measurement INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT fk_unit_measurement FOREIGN KEY (id_unit_measurement) REFERENCES unit_measurement (id) ON DELETE RESTRICT;

-- Adding new field to recipe_ingredients for quantity
-- Default value — 1
ALTER TABLE recipe_ingredients
ADD COLUMN quantity_recipe_ingredients DOUBLE PRECISION NOT NULL DEFAULT 1;

-- Adding unique constraint on name field in ingredients
ALTER TABLE ingredients ADD CONSTRAINT unique_name UNIQUE (name);

-- Adding new ingredients to ingredients table
INSERT INTO
    ingredients (name)
VALUES
    ('Cheese'),
    ('Pepper'),
    ('Pasta'),
    ('Olive oil') ON CONFLICT (name) DO NOTHING;

-- Updating unit measurements for existing ingredients
--(piece)
UPDATE ingredients
SET
    id_unit_measurement = 8
WHERE
    name IN (
        'Potato',
        'Onion',
        'Lemon',
        'Tomato',
        'Cucumber',
        'Garlic'
    );

--(gram)
UPDATE ingredients
SET
    id_unit_measurement = 1
WHERE
    name IN (
        'Carrot',
        'Basil',
        'Mushrooms',
        'Chicken fillet',
        'Flour',
        'Sugar',
        'Rice',
        'Cheese',
        'Pepper',
        'Pasta',
        'Tea'
    );

--(milliliter)
UPDATE ingredients
SET
    id_unit_measurement = 3
WHERE
    name IN (
        'Water',
        'Milk',
        'Sour cream',
        'Honey',
        'Olive oil'
    );

-- Adding field quantity_person_ingradient of type INTEGER
ALTER TABLE person_ingredients
ADD COLUMN quantity_person_ingradient INTEGER NOT NULL DEFAULT 1;

CREATE TABLE
    menu_category (
        menu_category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(50) NOT NULL,
        category_description TEXT
    );

-- Table for storing the menu itself
CREATE TABLE
    menu (
        menu_id SERIAL PRIMARY KEY,
        menu_title VARCHAR(100) NOT NULL,
        menu_content TEXT,
        category_id INT,
        person_id INT,
        FOREIGN KEY (category_id) REFERENCES menu_category (menu_category_id),
        FOREIGN KEY (person_id) REFERENCES person (id) -- Replace with correct column name if needed
    );

-- Linking table between menu and recipes
CREATE TABLE
    menu_recipe (
        menu_recipe_id SERIAL PRIMARY KEY,
        menu_id INT,
        recipe_id INT,
        FOREIGN KEY (menu_id) REFERENCES menu (menu_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes (id)
    );

INSERT INTO
    menu_category (category_name, category_description)
VALUES
    (
        'Breakfast',
        'Dishes for the morning meal that provide energy for the whole day.'
    ),
    ('Lunch', 'Hearty dishes for the midday meal'),
    (
        'Dinner',
        'Light or nourishing dishes for the evening meal'
    );

ALTER TABLE menu_recipe ADD CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES menu (menu_id) ON DELETE CASCADE;

--! andey 30.11 lybyyy
ALTER TABLE ingredients
ADD COLUMN allergens VARCHAR(255),
ADD COLUMN days_to_expire INTEGER,
ADD COLUMN seasonality VARCHAR(255),
ADD COLUMN storage_condition VARCHAR(255);

-- Example updates for ingredients:
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 30,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 1;

-- Potato
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 14,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 2;

-- Carrot
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 30,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 3;

-- Onion
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 7,
    seasonality = 'Summer, Autumn',
    storage_condition = '+4 - +8°C'
WHERE
    id = 4;

-- Tomato
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 7,
    seasonality = 'Summer, Autumn',
    storage_condition = '+4 - +8°C'
WHERE
    id = 5;

-- Cucumber
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 365,
    seasonality = 'All seasons',
    storage_condition = 'Room temperature'
WHERE
    id = 6;

-- Water
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 730,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 7;

-- Tea
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 21,
    seasonality = 'Winter, Spring',
    storage_condition = '+4 - +8°C'
WHERE
    id = 8;

-- Lemon
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 7,
    seasonality = 'Summer',
    storage_condition = '+4 - +8°C'
WHERE
    id = 9;

-- Basil
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 60,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 10;

-- Garlic
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 7,
    seasonality = 'All seasons',
    storage_condition = '+4 - +8°C'
WHERE
    id = 11;

-- Mushrooms
UPDATE ingredients
SET
    allergens = 'Dairy',
    days_to_expire = 14,
    seasonality = 'All seasons',
    storage_condition = '+4 - +8°C'
WHERE
    id = 12;

-- Sour cream
UPDATE ingredients
SET
    allergens = 'Poultry',
    days_to_expire = 2,
    seasonality = 'All seasons',
    storage_condition = '+4 - +8°C'
WHERE
    id = 13;

-- Chicken fillet
UPDATE ingredients
SET
    allergens = 'Dairy',
    days_to_expire = 7,
    seasonality = 'All seasons',
    storage_condition = '+4 - +8°C'
WHERE
    id = 14;

-- Milk
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 1095,
    seasonality = 'All seasons',
    storage_condition = 'Room temperature'
WHERE
    id = 15;

-- Honey
UPDATE ingredients
SET
    allergens = 'Gluten',
    days_to_expire = 365,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 16;

-- Flour
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 1825,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 17;

-- Sugar
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 730,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 18;

-- Rice
UPDATE ingredients
SET
    allergens = 'Dairy',
    days_to_expire = 30,
    seasonality = 'All seasons',
    storage_condition = '+4 - +8°C'
WHERE
    id = 19;

-- Cheese
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 1095,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 20;

-- Pepper
UPDATE ingredients
SET
    allergens = 'Gluten',
    days_to_expire = 730,
    seasonality = 'All seasons',
    storage_condition = 'Dry place, room temperature'
WHERE
    id = 21;

-- Pasta
UPDATE ingredients
SET
    allergens = 'None',
    days_to_expire = 730,
    seasonality = 'All seasons',
    storage_condition = 'Dark place, room temperature'
WHERE
    id = 22;

ALTER TABLE recipes ADD servings VARCHAR(255);

ALTER TABLE person_ingredients ADD purchase_date DATE DEFAULT CURRENT_DATE;

CREATE TABLE
    ingredient_purchases (
        id SERIAL PRIMARY KEY,
        person_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        quantity DOUBLE PRECISION NOT NULL,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
    );

ALTER TABLE ingredient_purchases
DROP CONSTRAINT IF EXISTS quantity;

ALTER TABLE ingredient_purchases
ALTER COLUMN quantity
SET DEFAULT 0;

ALTER TABLE ingredient_purchases
ALTER COLUMN quantity
SET
    NOT NULL;