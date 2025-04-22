import { pool } from "../config/database.config.js";
import { Client } from "ssh2";
import fs from "fs";

const uploadToCDN = (filePath, filename) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("SFTP connection established...");
        conn.sftp((err, sftp) => {
          if (err) return reject(err);

          const remotePath = `/var/www/cdn/images/${filename}`;

          sftp.fastPut(filePath, remotePath, {}, (err) => {
            if (err) {
              reject("Erreur de transfert SFTP : " + err);
            } else {
              console.log(`Fichier transféré avec succès vers ${remotePath}`);
              resolve(`https://cdn.lamedetony.fr/images/${filename}`);
            }
            conn.end();
          });
        });
      })
      .connect({
        host: "192.168.1.50",
        port: 22,
        username: "root",
        privateKey: fs.readFileSync(process.env.SSH_KEY_PATH),
      });
  });
};

export const createKnife = async (req, res) => {
  const {
    name,
    description,
    bladeMaterial,
    bladeLenght,
    handleMaterial,
    handleLenght,
  } = req.body;
  let imgUrl = null;

  console.log("🚀 ~ createKnife ~ req.file:", req.file);
  if (req.file) {
    const { filename, path: tempPath } = req.file;
    console.log("🚀 ~ createKnife ~ filename:", filename);

    try {
      imgUrl = await uploadToCDN(tempPath, filename);
      console.log("🚀 ~ createKnife ~ imgUrl:", imgUrl);

      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error("Erreur d'upload vers le CDN :", err);
      return res.status(500).send("Erreur lors du transfert du fichier.");
    }
  }

  try {
    await pool.query(
      `INSERT INTO knife (name, description, img, blade_material, blade_length, handle_material, handle_length) VALUES ($1, $2, $3, $4 ,$5, $6 ,$7)`,
      [
        name,
        description,
        imgUrl,
        bladeMaterial,
        bladeLenght,
        handleMaterial,
        handleLenght,
      ]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log("🚀 ~ file: post.controller.js:7 ~ createPost ~ error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllKnifes = async (_req, res) => {
  try {
    let result = await pool.query("SELECT * FROM knife");
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getKnifeById = async (req, res) => {
  try {
    let result = await pool.query(
      `SELECT id, name, description, img, blade_material, blade_length, handle_material, handle_length 
        FROM knife 
        WHERE id = $1`,
      [req.params.id]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.log("🚀 ~ getKnifeById ~ err:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const updateKnifeById = async (req, res) => {
  const {
    name,
    description,
    bladeMaterial,
    bladeLenght,
    handleMaterial,
    handleLenght,
  } = req.body;
  let imgUrl = null;
  if (req.file) {
    const { filename, path: tempPath } = req.file;

    try {
      imgUrl = "url New img";
      imgUrl = await uploadToCDN(tempPath, filename);

      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error("Erreur d'upload vers le CDN :", err);
      return res.status(500).send("Erreur lors du transfert du fichier.");
    }
  } else {
    imgUrl = await pool.query(`SELECT img FROM knife WHERE id = $1`, [
      req.params.id,
    ]);
  }

  try {
    await pool.query(
      `UPDATE knife
        SET name = $1, description = $2, img = $3, blade_material = $4, blade_length = $5, handle_material =$6 , handle_length = $7
        WHERE id = $8;`,
      [
        name,
        description,
        imgUrl,
        bladeMaterial,
        bladeLenght,
        handleMaterial,
        handleLenght,
        req.params.id,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("🚀 ~ updateKnifeById ~ err:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteKnifeById = async (req, res) => {
  console.log("🚀 ~ deleteKnifeById ~ req:", req.params);
  try {
    await pool.query(`DELETE FROM knife WHERE id = $1;`, [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("🚀 ~ deleteKnifeById ~ err:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
