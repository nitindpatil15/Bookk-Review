import { Router } from "express";
import authentication from "../Middleware/auth.js";
import { upload } from "../Middleware/upload.js";
import {getCurrentUser,
  userlogout, login, UserRegister } from "../Controller/user.controller.js";

const router = Router();

router.post("/signup", upload.single("avatar"), UserRegister);
router.post("/login", login);
router.get("/user/current-user", authentication, getCurrentUser);
router.post("/logout", authentication, userlogout);

export default router;
