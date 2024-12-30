import { Router } from "express";
// import { login, logout, myProfile, register } from "../controllers/user.js";
import { isAuthenticate } from "../middleware/auth.js";
import { CheckTools, CreateShell, DeleteShell, getShells, OpenShell } from "../controllers/shell.js";

const router = Router();

router.route('/add').post(CreateShell);
router.route('/delete').post(DeleteShell);
router.get('/check/tools', CheckTools);
router.route('/get/all').get(getShells);
router.post('/:name-:id', OpenShell);
// router.post('/login', login);
// router.get('/logout', logout);
// router.get('/me', isAuthenticate, myProfile);


export default router;