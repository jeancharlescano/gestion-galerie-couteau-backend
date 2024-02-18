import { register, login, refresh } from "../controller/auth.controller.js";

export default async function routes(fastify) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.post("/refresh", refresh);
}
