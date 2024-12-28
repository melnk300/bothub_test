import express from "express";
import {AuthController} from "../controllers/AuthController";

const router = express.Router();
let authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
