import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];
  console.log("🚀 ~ verifyToken ~ token:", token);

  try {
    console.log(
      "🚀 ~ verifyToken ~ process.env.JWT_SECRET:",
      process.env.JWT_SECRET
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🚀 ~ verifyToken ~ decoded:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("🚀 ~ verifyToken ~ err:", err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};
