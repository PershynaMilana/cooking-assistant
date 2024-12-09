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
    'Перше',
    '"Перше"  включає в себе різноманітні супи, бульйони та легкі закуски, які не лише розігрівають душу, але й пробуджують апетит.'
  ),
  (
    'Друге',
    'Друга страва — основа ситної трапези. Це м’ясні, рибні або овочеві страви, які наповнюють енергією і додають відчуття задоволення після їжі.'
  ),
  (
    'Десерт',
    'Десерт — це солодкий фінал кулінарної подорожі. Торти, пироги, тістечка та інші ласощі створюють незабутні миті насолоди для всіх любителів солодкого.'
  ),
  (
    'Напій',
    'Напої — це доповнення до будь-якої страви. Вони можуть бути гарячими, холодними, освіжаючими або бадьорими, підкреслюючи смаки і додаючи завершеності трапезі.'
  );

INSERT INTO
  ingredients (name)
VALUES
  ('Картопля'),
  ('Морква'),
  ('Цибуля'),
  ('Томат'),
  ('Огірок'),
  ('Вода'),
  ('Чай'),
  ('Лимон');

ALTER TABLE recipes
ADD COLUMN creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE recipes
ADD COLUMN cooking_time INTEGER;

INSERT INTO
  ingredients (name)
VALUES
  ('Базилік'),
  ('Часник'),
  ('Гриби'),
  ('Сметана'),
  ('Куряче філе'),
  ('Молоко'),
  ('Мед'),
  ('Борошно'),
  ('Цукор'),
  ('Рис');

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
-- Создаем таблицу для единиц измерения
CREATE TABLE
  unit_measurement (
    id SERIAL PRIMARY KEY,
    unit_name VARCHAR(255) NOT NULL, -- Название единицы измерения
    coefficient DOUBLE PRECISION -- Коэффициент перевода в граммы, NULL если неприменимо
  );

-- Заполняем таблицу unit_measurement основными единицами измерения
INSERT INTO
  unit_measurement (unit_name, coefficient)
VALUES
  ('грам', 1), -- 1 грам = 1 грам
  ('кілограм', 1000), -- 1 кг = 1000 грам
  ('мілілітр', 1), -- 1 мл води = 1 грам (приблизно)
  ('літр', 1000), -- 1 л води = 1000 грам (приблизно)
  ('чайна ложка', 5), -- 1 чайна ложка = 5 грам (приблизно)
  ('столова ложка', 15), -- 1 столова ложка = 15 грам (приблизно)
  ('склянка', 250), -- 1 склянка = 250 грам (приблизно)
  ('штука', NULL);

-- "Штука" без переводу в грам
-- Добавляем новое поле в таблицу ingredients для хранения id_unit_measurement
-- Ставим значение по умолчанию 1 (граммы)
ALTER TABLE ingredients
ADD COLUMN id_unit_measurement INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT fk_unit_measurement FOREIGN KEY (id_unit_measurement) REFERENCES unit_measurement (id) ON DELETE RESTRICT;

-- Добавляем новое поле в таблицу recipe_ingredients для количества
-- Значение по умолчанию — 1
ALTER TABLE recipe_ingredients
ADD COLUMN quantity_recipe_ingredients DOUBLE PRECISION NOT NULL DEFAULT 1;

-- Пример обновления существующих данных:
-- Для определенных ингредиентов устанавливаем "штука"
UPDATE ingredients
SET
  id_unit_measurement = (
    SELECT
      id
    FROM
      unit_measurement
    WHERE
      unit_name = 'штука'
  )
WHERE
  name IN ('Картопля', 'Цибуля', 'Яйце', 'Лимон');

-- Добавляем уникальное ограничение на поле name в таблице ingredients
ALTER TABLE ingredients ADD CONSTRAINT unique_name UNIQUE (name);

-- Добавляем новые ингредиенты в таблицу ingredients
INSERT INTO
  ingredients (name)
VALUES
  ('Сир'),
  ('Перець'),
  ('Паста'),
  ('Оливкова олія') ON CONFLICT (name) DO NOTHING;

-- Обновляем единицы измерения для существующих ингредиентов
UPDATE ingredients
SET
  id_unit_measurement = 1
WHERE
  name IN (
    'Томат',
    'Сир',
    'Базилік',
    'Курка',
    'Чеснок',
    'Сіль',
    'Перець',
    'Паста',
    'Оливкова олія',
    'Морква',
    'Огірок',
    'Вода',
    'Чай'
  );

UPDATE ingredients
SET
  id_unit_measurement = 8
WHERE
  name IN ('Картопля', 'Цибуля', 'Лимон');

-- Добавляем поле quantity_person_ingradient с типом INTEGER
ALTER TABLE person_ingredients
ADD COLUMN quantity_person_ingradient INTEGER NOT NULL DEFAULT 1;

--*24.11
-- Таблица для хранения категорий меню (завтрак, обед, ужин)
CREATE TABLE
  menu_category (
    menu_category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    category_description TEXT
  );

-- Таблица для хранения самого меню
CREATE TABLE
  menu (
    menu_id SERIAL PRIMARY KEY,
    menu_title VARCHAR(100) NOT NULL,
    menu_content TEXT,
    category_id INT,
    person_id INT,
    FOREIGN KEY (category_id) REFERENCES menu_category (menu_category_id),
    FOREIGN KEY (person_id) REFERENCES person (id) -- Заменить на корректное имя столбца
  );

-- Связующая таблица для связи меню и рецептов
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
    'Сніданок',
    'Страви для ранкового прийому їжі, що заряджають енергією на весь день'
  ),
  ('Обід', 'Ситні страви для денного прийому їжі'),
  (
    'Вечеря',
    'Легкі або поживні страви для вечірнього прийому їжі'
  );

ALTER TABLE menu_recipe ADD CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES menu (menu_id) ON DELETE CASCADE;

--! andey 30.11 lybyyy
ALTER TABLE ingredients
ADD COLUMN allergens VARCHAR(255),
ADD COLUMN days_to_expire INTEGER,
ADD COLUMN seasonality VARCHAR(255),
ADD COLUMN storage_condition VARCHAR(255);

UPDATE ingredients
SET
  allergens = 'Яйця',
  days_to_expire = 7,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 1;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = NULL,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 2;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 30,
  seasonality = 'Літо, осінь',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 3;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 180,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +20°C'
WHERE
  id = 4;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 90,
  seasonality = 'Осінь, зима',
  storage_condition = '+4 - +8°C'
WHERE
  id = 5;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 60,
  seasonality = 'Осінь, зима',
  storage_condition = '+4 - +8°C'
WHERE
  id = 6;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 120,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 7;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 10,
  seasonality = 'Літо, осінь',
  storage_condition = '+4 - +8°C'
WHERE
  id = 8;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 7,
  seasonality = 'Літо',
  storage_condition = '+4 - +8°C'
WHERE
  id = 9;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = NULL,
  seasonality = 'Усі сезони',
  storage_condition = 'Кімнатна температура'
WHERE
  id = 10;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = NULL,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 11;

UPDATE ingredients
SET
  allergens = 'Цитрусові',
  days_to_expire = 20,
  seasonality = 'Зима, весна',
  storage_condition = '+4 - +8°C'
WHERE
  id = 12;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 7,
  seasonality = 'Літо',
  storage_condition = '+4 - +8°C'
WHERE
  id = 13;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 180,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 14;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 5,
  seasonality = 'Осінь',
  storage_condition = '+4 - +8°C'
WHERE
  id = 15;

UPDATE ingredients
SET
  allergens = 'Молочні',
  days_to_expire = 10,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 16;

UPDATE ingredients
SET
  allergens = 'Курятина',
  days_to_expire = 3,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 17;

UPDATE ingredients
SET
  allergens = 'Молочні',
  days_to_expire = 7,
  seasonality = 'Усі сезони',
  storage_condition = '+4 - +8°C'
WHERE
  id = 18;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = NULL,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 19;

UPDATE ingredients
SET
  allergens = 'Глютен',
  days_to_expire = 180,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 20;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = NULL,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 21;

UPDATE ingredients
SET
  allergens = 'Немає',
  days_to_expire = 365,
  seasonality = 'Усі сезони',
  storage_condition = 'Сухе місце, кімнатна температура'
WHERE
  id = 22;

ALTER TABLE recipes ADD servings VARCHAR(255);

ALTER TABLE person_ingredients ADD purchase_date DATE DEFAULT CURRENT_DATE;

--! 09.12 lublu
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