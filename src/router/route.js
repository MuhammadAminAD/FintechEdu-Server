import { Router } from "express";
import RegisterController from "../controllers/auth/Register/register.js";

const router = Router();

router.post("/auth/regsiter/step1", (req, res) => RegisterController.Step1(req, res));
router.post("/auth/regsiter/step2", (req, res) => RegisterController.Step2(req, res));
router.post("/auth/regsiter/step3", (req, res) => RegisterController.Step3(req, res));
router.post("/auth/regsiter/step4", (req, res) => RegisterController.Step4(req, res));

export default router;