import { Router } from "express";
import { AuthController } from "../infrastructure/controller/auth.controller";
import { UserService } from "../service/user.service";
import { UserRepository } from "../repository/users.repository";
import { AppDataSource } from "../infrastructure/database/database";
import { User } from "../infrastructure/entity/users.entity";

const router = Router();

// Instanciar dependencias igual que en server.ts
const userService = new UserService(new UserRepository(AppDataSource.getRepository(User)));
const authController = new AuthController(userService);

router.post("/login", authController.login.bind(authController));

export default router; 