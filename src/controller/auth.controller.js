import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.config.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const register = async (req, rep) => {
  const { username, email, password } = req.body;

  try {
    const usernameExists = await pool.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );
    const emailExists = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (usernameExists.rows.length > 0) {
      return rep.status(400).send("Username already exists");
    }

    if (emailExists.rows.length > 0) {
      return rep.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    return "User registered successfully";
  } catch (error) {
    console.log("Error:", error);
    rep.status(500).send("Internal Server Error");
  }
};

export const login = async (req, rep) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      rep.status(401).send("Invalid email or password");
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      rep.status(401).send("Invalid email or password");
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, userEmail: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ userId: user.id, userEmail: user.email }, REFRESH_TOKEN, {expiresIn: "90 days"});

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error:", error);
    rep.status(500).send("Internal Server Error");
  }
};

export const refresh = async (req, rep) => {
  const { refreshToken } = req.body;
  console.log("🚀 ~ refresh ~ refreshToken:", refreshToken)

  if (!refreshToken) {
    rep.status(400).send("Bad Request: Missing refresh token");
    return;
  }

  try {
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN);

    // Vous pouvez également vérifier la validité du refresh token ici

    // Générer un nouveau jeton d'accès
    const accessToken = jwt.sign({ userId: decodedToken.userId, userEmail: decodedToken.userEmail }, JWT_SECRET, {
      expiresIn: "6h",
    });

    rep.send({ accessToken });
  } catch (error) {
    rep.status(401).send("Unauthorized: Invalid refresh token");
  }
};
