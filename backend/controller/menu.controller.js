const pool = require("../db"); // Импортируем конфигурацию базы данных
const db = require("../db");
// Контроллер для получения всех меню
const getAllMenus = async (req, res) => {
  try {
    let { menu_name, category_ids } = req.query;

    // Декодируем параметр menu_name
    if (menu_name) {
      menu_name = decodeURIComponent(menu_name);
      console.log("Decoded menu_name:", menu_name);  // Печатаем в консоли декодированное значение
    }

    let query = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        mc.category_name AS categoryName,
        m.menu_content AS menuContent
      FROM menu m
             LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
    `;

    const queryParams = [];

    if (menu_name) {
      // Ищем по названию меню
      query += ` WHERE m.menu_title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${menu_name}%`);
    }

    if (category_ids) {
      const categoryArray = category_ids.split(",").map(Number);
      if (menu_name) {
        query += ` AND m.category_id = ANY($${queryParams.length + 1})`;
      } else {
        query += ` WHERE m.category_id = ANY($${queryParams.length + 1})`;
      }
      queryParams.push(categoryArray);
    }

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Контроллер для создания нового меню
const createMenu = async (req, res) => {
  const { menu_title, menu_content, category_id, person_id } = req.body;

  // Проверяем, что все обязательные поля переданы
  if (!menu_title || !menu_content || !category_id || !person_id) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    // SQL-запрос для вставки нового меню
    const query = `
      INSERT INTO menu (menu_title, menu_content, category_id, person_id)
      VALUES ($1, $2, $3, $4)
        RETURNING menu_id, menu_title, menu_content, category_id, person_id
    `;
    const values = [menu_title, menu_content, category_id, person_id];

    // Выполняем запрос
    const result = await pool.query(query, values);

    // Возвращаем данные созданного меню
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createMenuWithRecipes = async (req, res) => {
  const { menuTitle, menuContent, categoryId, personId, recipeIds } = req.body; // Данные из клиента

  if (!menuTitle || !categoryId || !personId || !recipeIds || recipeIds.length === 0) {
    return res.status(400).json({ message: "Недостаточно данных для создания меню" });
  }

  const client = await db.connect(); // Подключение к базе данных
  try {
    await client.query("BEGIN"); // Начало транзакции

    // Вставляем запись в таблицу меню
    const menuResult = await client.query(
        `INSERT INTO menu (menu_title, menu_content, category_id, person_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING menu_id`,
        [menuTitle, menuContent, categoryId, personId]
    );
    const menuId = menuResult.rows[0].menu_id;

    // Вставляем записи в таблицу menu_recipe
    const recipeInsertPromises = recipeIds.map((recipeId) =>
        client.query(
            `INSERT INTO menu_recipe (menu_id, recipe_id) 
                 VALUES ($1, $2)`,
            [menuId, recipeId]
        )
    );
    await Promise.all(recipeInsertPromises); // Выполнение всех вставок

    await client.query("COMMIT"); // Фиксация транзакции
    res.status(201).json({ message: "Меню успешно создано", menuId });
  } catch (error) {
    await client.query("ROLLBACK"); // Откат транзакции при ошибке
    console.error("Ошибка при создании меню с рецептами:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    client.release(); // Освобождение клиента
  }
};


async function getRecipeWithIngredients(recipeId) {
  try {
    const recipe = await db.query(
        `SELECT r.*, array_agg(i.name) AS ingredients, rt.type_name
       FROM recipes r
       LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
       LEFT JOIN ingredients i ON ri.ingredient_id = i.id
       LEFT JOIN recipe_types rt ON r.type_id = rt.id
       WHERE r.id = $1
       GROUP BY r.id, rt.type_name`,
        [recipeId]
    );

    if (recipe.rows.length === 0) {
      throw new Error("Рецепт не знайдено");
    }

    return recipe.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}



const getMenuWithRecipes = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  try {
    // Получаем меню по ID
    const menuQuery = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        m.menu_content AS menuContent,
        mc.category_name AS categoryName
      FROM menu m
             LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
      WHERE m.menu_id = $1
    `;
    const menuResult = await pool.query(menuQuery, [id]);

    if (menuResult.rows.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Получаем привязанные рецепты
    const recipeQuery = `
      SELECT r.id AS recipe_id
      FROM recipes r
             JOIN menu_recipe mr ON r.id = mr.recipe_id
      WHERE mr.menu_id = $1
    `;
    const recipeResult = await pool.query(recipeQuery, [id]);

    // Получаем подробную информацию о каждом рецепте
    const recipesWithDetails = [];
    for (let recipe of recipeResult.rows) {
      const recipeDetails = await getRecipeWithIngredients(recipe.recipe_id);  // Получаем рецепт с ингредиентами
      recipesWithDetails.push(recipeDetails);  // Добавляем рецепт с деталями в массив
    }

    // Формируем итоговый ответ
    const menu = menuResult.rows[0];
    res.status(200).json({ menu, recipes: recipesWithDetails });
  } catch (error) {
    console.error("Error fetching menu with recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// Контроллер для удаления меню
const deleteMenu = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Начинаем транзакцию

    // Удаляем записи из таблицы menu_recipe, связанные с удаляемым меню
    const deleteMenuRecipeQuery = "DELETE FROM menu_recipe WHERE menu_id = $1";
    await client.query(deleteMenuRecipeQuery, [id]);

    // Удаляем меню из таблицы menu
    const deleteMenuQuery = "DELETE FROM menu WHERE menu_id = $1 RETURNING menu_id";
    const result = await client.query(deleteMenuQuery, [id]);

    if (result.rowCount === 0) {
      await client.query('COMMIT'); // Коммитим транзакцию
      return res.status(404).json({ message: "Menu not found" });
    }

    await client.query('COMMIT'); // Коммитим транзакцию
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); // Освобождаем клиент
  }
};



module.exports = { getAllMenus, createMenu, deleteMenu, getMenuWithRecipes, createMenuWithRecipes };
