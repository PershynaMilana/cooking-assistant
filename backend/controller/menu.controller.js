const pool = require("../db");
const db = require("../db");

//? Отримання всіх меню
const getAllMenus = async (req, res) => {
  try {
    let { menu_name, category_ids } = req.query;

    if (menu_name) {
      menu_name = decodeURIComponent(menu_name);
      console.log("Decoded menu_name:", menu_name);
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

//? Створення меню
const createMenuWithRecipes = async (req, res) => {
  const { menuTitle, menuContent, categoryId, personId, recipeIds } = req.body;

  if (!menuTitle || !categoryId || !personId || !recipeIds || recipeIds.length === 0) {
    return res.status(400).json({ message: "Недостаточно данных для создания меню" });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const menuResult = await client.query(
        `INSERT INTO menu (menu_title, menu_content, category_id, person_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING menu_id`,
        [menuTitle, menuContent, categoryId, personId]
    );
    const menuId = menuResult.rows[0].menu_id;

    const recipeInsertPromises = recipeIds.map((recipeId) =>
        client.query(
            `INSERT INTO menu_recipe (menu_id, recipe_id) 
                 VALUES ($1, $2)`,
            [menuId, recipeId]
        )
    );
    await Promise.all(recipeInsertPromises);

    await client.query("COMMIT");
    res.status(201).json({ message: "Меню успешно создано", menuId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Ошибка при создании меню с рецептами:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    client.release();
  }
};

//? Оновлення меню
const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { menuTitle, menuContent, categoryId, recipeIds } = req.body;

  if (!id || !menuTitle || !categoryId || !recipeIds || recipeIds.length === 0) {
    return res.status(400).json({ message: "Недостаточно данных для обновления меню" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateMenuQuery = `
      UPDATE menu 
      SET menu_title = $1, menu_content = $2, category_id = $3 
      WHERE menu_id = $4
    `;
    await client.query(updateMenuQuery, [menuTitle, menuContent, categoryId, id]);

    const deleteRecipesQuery = "DELETE FROM menu_recipe WHERE menu_id = $1";
    await client.query(deleteRecipesQuery, [id]);

    const addRecipesPromises = recipeIds.map((recipeId) => {
      return client.query(
          "INSERT INTO menu_recipe (menu_id, recipe_id) VALUES ($1, $2)",
          [id, recipeId]
      );
    });
    await Promise.all(addRecipesPromises);

    await client.query("COMMIT");
    res.status(200).json({ message: "Меню успешно обновлено" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Ошибка при обновлении меню:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    client.release();
  }
};

//? функція отримання рецептів
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

//? Отримання меню по ID
const getMenuWithRecipes = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  try {
    const menuQuery = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        m.menu_content AS menuContent,
        mc.category_name AS categoryName,
        m.category_id AS categoryId  
      FROM menu m
             LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
      WHERE m.menu_id = $1
    `;
    const menuResult = await pool.query(menuQuery, [id]);

    if (menuResult.rows.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const recipeQuery = `
      SELECT r.id AS recipe_id
      FROM recipes r
             JOIN menu_recipe mr ON r.id = mr.recipe_id
      WHERE mr.menu_id = $1
    `;
    const recipeResult = await pool.query(recipeQuery, [id]);

    const recipesWithDetails = [];
    for (let recipe of recipeResult.rows) {
      const recipeDetails = await getRecipeWithIngredients(recipe.recipe_id);
      recipesWithDetails.push(recipeDetails);
    }

    const menu = menuResult.rows[0];
    res.status(200).json({ menu, recipes: recipesWithDetails });
  } catch (error) {
    console.error("Error fetching menu with recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//? Видалення меню
const deleteMenu = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const deleteMenuRecipeQuery = "DELETE FROM menu_recipe WHERE menu_id = $1";
    await client.query(deleteMenuRecipeQuery, [id]);

    const deleteMenuQuery = "DELETE FROM menu WHERE menu_id = $1 RETURNING menu_id";
    const result = await client.query(deleteMenuQuery, [id]);

    if (result.rowCount === 0) {
      await client.query('COMMIT');
      return res.status(404).json({ message: "Menu not found" });
    }

    await client.query('COMMIT');
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

//? Отримання меню користувача
const searchPersonMenus = async (req, res) => {
  try {
    const { id } = req.params;
    let { menu_name, category_ids } = req.query;

    if (menu_name) {
      menu_name = decodeURIComponent(menu_name);
      console.log("Decoded menu_name:", menu_name);
    }

    let query = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        mc.category_name AS categoryName,
        m.menu_content AS menuContent
      FROM menu m
      LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
      WHERE m.person_id = $1  
    `;

    const queryParams = [id];

    if (menu_name) {
      query += ` AND m.menu_title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${menu_name}%`);
    }

    if (category_ids) {
      const categoryArray = category_ids.split(",").map(Number);
      query += ` AND m.category_id = ANY($${queryParams.length + 1})`;
      queryParams.push(categoryArray);
    }

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllMenus, deleteMenu, getMenuWithRecipes, createMenuWithRecipes, updateMenu, searchPersonMenus };