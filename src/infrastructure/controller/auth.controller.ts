import { Request, Response } from "express";
import { UserService } from "../../service/user.service";
import { LoginDto } from "../dto/users.dto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "frialux-secret";

export class AuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto: LoginDto = req.body;
      console.log(loginDto);
      const user = await this.userService.login(loginDto);
    
      
      // Generar JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          roleId: user.roleId,
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
} 