import { Router } from "express";

import * as controller from "./auth.controller.js";

import validate from "../../common/middleware/validate.middleware.js";

import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";

import { authenticate } from "./auth.middleware.js";

const router = Router();

// Register
router.post("/register", validate(RegisterDto), controller.register);

// Login
router.post("/login", validate(LoginDto), controller.login);

// Current user
router.get("/me", authenticate, controller.getMe);

// Logout
router.post("/logout", authenticate, controller.logout);

export default router;
