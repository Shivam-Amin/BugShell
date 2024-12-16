import jwt from "jsonwebtoken";
import db from '../models/index.js';
import { config } from "dotenv";
config();

export const isAuthenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login first",
    })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  req.user = await db.users.findByPk(decoded._id)
  next();
}