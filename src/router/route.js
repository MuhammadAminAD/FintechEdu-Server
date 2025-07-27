import { Router } from "express";
import Register from "../controllers/auth/register.js";
import Login from "../controllers/auth/login.js";
import resetPassword from "../controllers/auth/resetPassword.js";
import { refreshAccessToken } from "../controllers/auth/refreshAccess.js";

const router = Router();
// registration
router.post("/auth/registration/request-code", (req, res) => Register.request(req, res));
router.post("/auth/registration/verify-code", (req, res) => Register.verify(req, res));
router.post("/auth/registration/create-user", (req, res) => Register.create(req, res));


// Login
router.post("/auth/login", (req, res) => Login(req, res));


// resert password
router.post("/auth/reset-password/request-code", (req, res) => resetPassword.request(req, res));
router.post("/auth/reset-password/verify-code", (req, res) => resetPassword.verify(req, res));
router.post("/auth/reset-password/chenge-password", (req, res) => resetPassword.complete(req, res));

// token
router.post("/auth/refresh", (req, res) => refreshAccessToken(req, res));

export default router;