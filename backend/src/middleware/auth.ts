import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Invalid token format" });

  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JSONSECRET!) as JwtPayload;
    req.user = decoded.user._id;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default auth;
