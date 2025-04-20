import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(process.env.APP_PORT, () =>
  console.log("Server on APP_PORT", process.env.APP_PORT)
);
