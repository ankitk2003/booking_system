
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
//@ts-ignore
function userMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.userId = decoded.id;
    req.role = decoded.role;
    console.log(decoded);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token verification failed.", error: error });
  }
}

export { userMiddleware };
