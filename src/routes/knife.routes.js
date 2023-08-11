import {
  createKnife,
  deleteKnifeById,
  getAllKnifes,
  getKnifeById,
  updateKnifeById,
} from "../controller/knife.controller.js";

export default async function routes(fastify) {
  fastify.post("/", createKnife),
    fastify.get("/", getAllKnifes),
    fastify.get("/:id", getKnifeById),
    fastify.put("/update/:id", updateKnifeById),
    fastify.delete("/delete/:id", deleteKnifeById);
}
