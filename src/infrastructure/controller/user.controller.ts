// src/controllers/role.controller.ts
import { Request, Response } from 'express';
import { CreateUserDto } from '../dto/users.dto';
import { UserService } from '../../service/user.service';

export class UserController {
  private readonly userService: UserService;

  constructor(service: UserService) {
    this.userService = service;
}


  async getPaginated(req: Request, res: Response){
    try {
        const { page, items } = req.query;
        console.log(req.query);
        
        const parsedPage = Number(page) - 1;
        const parsedItems = Number(items);

        if(parsedPage<0){
            throw new Error("Wrong data")
        }

        const result = await this.userService.getPaginated( parsedPage, parsedItems);
        res.status(200).json(result);
  
    } catch (error) {
      
        res.status(400).json({ message: error.message });
      
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const data: CreateUserDto = req.body;
      const newUser = await this.userService.createUser(data)
      res.status(201).json(newUser);
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}