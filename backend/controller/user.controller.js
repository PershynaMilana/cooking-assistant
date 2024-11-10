const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};

class UserController {

  //? register new user
  async registerUser(req, res) {
    const { name, surname, login, password } = req.body;

    try {
      // hash password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const newUser = await db.query(
          `INSERT INTO person (name, surname, login, password) VALUES ($1, $2, $3, $4) RETURNING *`,
          [name, surname, login, hashedPassword]
      );


      res.status(201).json(newUser.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? login existing user
  async loginUser(req, res) {
    const { login, password } = req.body;

    try {
      // search by login
      const user = await db.query(`SELECT * FROM person WHERE login = $1`, [login]);

      if (user.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // check pass
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // generating and sending JWT token to the client
      const token = generateToken(user.rows[0].id);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? get all users
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
