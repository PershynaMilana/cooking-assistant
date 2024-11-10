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

--TODO: валидация на регистрации на логине + перевести все на укр

--TODO: рецепты показывались только пользователя и отдельной вкладкой добавить свои рецепты

--TODO: когда пользователь удаляется, то удалять все его рецепты + ингридиенты
