const pool = require("../db"); // Імпортуємо конфігурацію бази даних

// Контролер для отримання всіх меню
const getAllMenus = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.menu_id AS id, 
        m.menu_title AS title,
        mc.category_name AS categoryName,
        m.menu_content AS menuContent
      FROM menu m
      LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllMenus };
