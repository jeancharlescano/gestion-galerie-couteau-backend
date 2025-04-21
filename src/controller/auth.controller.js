import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.config.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const emailExists = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (firstname, lastname, email, password, isAdmin) VALUES ($1, $2, $3, $4, $5)`,
      [firstname, lastname, email, hashedPassword, false]
    );

    res.status(200).send("Done");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(401).send("Invalid email or password");
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).send("Invalid email or password");
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, userEmail: user.email, isAdmin: user.isadmin },
      JWT_SECRET,
      { expiresIn: "6h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, userEmail: user.email, isAdmin: user.isadmin },
      REFRESH_TOKEN,
      { expiresIn: "90 days" }
    );

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).send("Bad Request: Missing refresh token");
    return;
  }

  try {
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN);

    // Générer un nouveau jeton d'accès
    const accessToken = jwt.sign(
      {
        userId: decodedToken.userId,
        userEmail: decodedToken.userEmail,
        isAdmin: decodedToken.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(401).send("Unauthorized: Invalid refresh token");
  }
};
