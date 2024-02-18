import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.routes.js";
import knifeRoutes from "./routes/knife.routes.js";
import dotenv from "dotenv";

dotenv.config();


const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyCors, {
  origin: true,
});

fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(knifeRoutes, { prefix: "/api/knife" });

fastify.addHook("preHandler", async (req, rep) => {
  // if (req.url.includes("/knife")) {
  //   try {
  //     const token = req.headers.authorization.split(" ")[1];
  //     if (!token) {
  //       rep.status(401).send("Unauthorized: Missing token");
  //       return;
  //     }

  //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //     req.userId = decodedToken.userId;
  //   } catch (error) {
  //     rep.status(401).send("Unauthorized: Invalid token");
  //     return;
  //   }
  // }
});

// Run the server!
fastify.listen(
  { port: process.env.APP_PORT, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`server listening on ${address}`);
  }
);
