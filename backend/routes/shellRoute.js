import { Router } from "express";
// import { login, logout, myProfile, register } from "../controllers/user.js";
import { isAuthenticate } from "../middleware/auth.js";
import { CheckTools, CreateSession, DeleteSession, getShells, OpenShellSession } from "../controllers/shell.js";

const router = Router();

router.route('/add').post(isAuthenticate, CreateSession);
router.route('/delete').post(isAuthenticate, DeleteSession);
router.get('/check/tools', isAuthenticate, CheckTools);
router.route('/get/all').get(isAuthenticate, getShells);
router.post('/:name-:id', isAuthenticate, OpenShellSession);
// router.post('/login', login);
// router.get('/logout', logout);
// router.get('/me', isAuthenticate, myProfile);


export default router;