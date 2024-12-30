import bcrypt from'bcrypt';
import { sendCookie } from "../utils/features.js";
import { ErrorHandler } from "../middleware/err.js";

import db from '../models/index.js';
import { generateUUID } from '../utils/idGenrator.js';

export const login = async (req, res, next) => {
  try {    
    const { email, password } = req.body;    

    // check for a user exists with same email
    let user = await db.users.findOne({ where: { email: email } });
    // if no user, means user can't login but can register.
    if (!user) {
      return next(new ErrorHandler("Invalid email or password!", 404));
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password!", 404));
    }
    sendCookie(user, res, `Welcome back, ${user.username}`, 200);
  } catch (error) {
    next(error);
  }
}

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {expires: 
      new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "Production" ? true : false,
    })
    .json({
      success: true,
      message: "Logout Successfully!",
  })
}

export const myProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: 'BugShell',
  })
}

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
  
    // check for a user exists with same email
    let user = await db.users.findOne({ where: { email: email } });

  
    if (user) {
      return next(new ErrorHandler("User already exist...", 404));
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const uuid = await generateUUID(db.users);

    // ADD NEW USER TO DB
    user = await db.users.create({ 
      _id: uuid, 
      username: username, 
      email: email, 
      password: hashedPassword,
      github_id: null,
      github_username: null,
      avatar_url: null,
      auth_provider: 'local' });
  
    // sendCookie(user, res, "Registered Successfully!", 201);
  } catch (error) {
    next(error);
  }
}