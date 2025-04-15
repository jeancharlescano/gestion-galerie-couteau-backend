import { pool } from "../config/database.config.js";

export const createKnife = async (req, rep) => {
  const {
    name,
    description,
    img,
    bladeMaterial,
    bladeLenght,
    handleMaterial,
    handleLenght,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO knife (name, description, img, blade_material, blade_length, handle_material, handle_length) VALUES ($1, $2, $3, $4 ,$5, $6 ,$7)`,
      [
        name,
        description,
        img,
        bladeMaterial,
        bladeLenght,
        handleMaterial,
        handleLenght,
      ]
    );
    return rep.sendStatus(200);
  } catch (error) {
    console.log("🚀 ~ file: post.controller.js:7 ~ createPost ~ error:", error);
    rep.status(500).send("Internal Server Error");
  }
};

export const getAllKnifes = async (_req, rep) => {
  try {
    let result = await pool.query("SELECT * FROM knife");
    return result.rows;
  } catch (err) {
    console.log(err);
    rep.status(500).send("Internal Server Error");
  }
};

export const getKnifeById = async (req, rep) => {
  try {
    let result = await pool.query(
      `SELECT id, name, description, img, blade_material, blade_length, handle_material, handle_length 
        FROM knife 
        WHERE id = $1`,
      [req.params.id]
    );
    return result.rows;
  } catch (err) {
    console.log("🚀 ~ getKnifeById ~ err:", err);
    rep.status(500).send("Internal Server Error");
  }
};

export const updateKnifeById = async (req, rep) => {
  const {
    name,
    description,
    img,
    bladeMaterial,
    bladeLenght,
    handleMaterial,
    handleLenght,
  } = req.body;

  try {
    pool.query(
      `UPDATE knife 
        SET name = $1, description = $2, img = $3, blade_material = $4, blade_length = $5, handle_material =$6 , handle_length = $7 
        WHERE id = $8;`,
      [
        name,
        description,
        img,
        bladeMaterial,
        bladeLenght,
        handleMaterial,
        handleLenght,
        req.params.id,
      ]
    );
    return "Done";
  } catch (err) {
    console.log(err);
  }
};

export const deleteKnifeById = async (req, rep) => {
  console.log("🚀 ~ deleteKnifeById ~ req:", req.params);
  try {
    pool.query(`DELETE FROM knife WHERE id = $1;`, [req.params.id]);
    return "Done";
  } catch (err) {
    console.log(err);
    rep.status(500).send("Internal Server Error");
  }
};
