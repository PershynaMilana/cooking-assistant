-- Up Migration

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT unique_login UNIQUE (login)
);

CREATE TABLE unit_measurement (
    id SERIAL PRIMARY KEY,
    unit_name VARCHAR(255) NOT NULL,
    coefficient DOUBLE PRECISION
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_unit_measurement INTEGER NOT NULL DEFAULT 1,
    allergens VARCHAR(255),
    days_to_expire INTEGER,
    seasonality VARCHAR(255),
    storage_condition VARCHAR(255),
    CONSTRAINT unique_name UNIQUE (name),
    CONSTRAINT fk_unit_measurement FOREIGN KEY (id_unit_measurement)
        REFERENCES unit_measurement (id) ON DELETE RESTRICT
);

CREATE TABLE recipe_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    person_id INTEGER NOT NULL,
    type_id INTEGER,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cooking_time INTEGER,
    servings VARCHAR(255),
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES recipe_types (id) ON DELETE SET NULL
);

CREATE TABLE recipe_ingredients (
    recipe_id INTEGER,
    ingredient_id INTEGER,
    quantity_recipe_ingredients DOUBLE PRECISION NOT NULL DEFAULT 1,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
);

CREATE TABLE person_ingredients (
    person_id INTEGER,
    ingredient_id INTEGER,
    quantity_person_ingradient INTEGER NOT NULL DEFAULT 1,
    purchase_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (person_id, ingredient_id),
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
);

CREATE TABLE menu_category (
    menu_category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    category_description TEXT
);

CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    menu_title VARCHAR(100) NOT NULL,
    menu_content TEXT,
    category_id INT,
    person_id INT,
    FOREIGN KEY (category_id) REFERENCES menu_category (menu_category_id),
    FOREIGN KEY (person_id) REFERENCES person (id)
);

CREATE TABLE menu_recipe (
    menu_recipe_id SERIAL PRIMARY KEY,
    menu_id INT,
    recipe_id INT,
    CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES menu (menu_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

CREATE TABLE ingredient_purchases (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
);

-- Down Migration

DROP TABLE IF EXISTS ingredient_purchases CASCADE;
DROP TABLE IF EXISTS menu_recipe CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS menu_category CASCADE;
DROP TABLE IF EXISTS person_ingredients CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS recipe_types CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS unit_measurement CASCADE;
DROP TABLE IF EXISTS person CASCADE;
