const db = require("../db");

class UserController {
  async createUser(req, res) {
    const { name, surname } = req.body;

    try {
      const newUser = await db.query(
        `INSERT INTO person (name, surname) VALUES ($1, $2) RETURNING *`,
        [name, surname]
      );
      res.json(newUser.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.query(`SELECT * FROM person`);
      res.json(users.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
