import { Router } from "express";
import { login, logout, myProfile, register } from "../controllers/user.js";
import { isAuthenticate } from "../middleware/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isAuthenticate, myProfile);


export default router;