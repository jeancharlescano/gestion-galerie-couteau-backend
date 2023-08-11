import { register, login } from "../controller/auth.controller.js";

export default async function routes(fastify) {
  fastify.post("/register", register);
  fastify.post("/login", login);
}
