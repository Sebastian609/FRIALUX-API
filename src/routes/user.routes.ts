import { Router } from 'express';
import { UserController } from '../infrastructure/controller/user.controller';

export class UserRoutes {
  private router: Router;
  private controller

  constructor(userController: UserController) {
    this.router = Router();
    this.controller = userController;
    this.router.post('/', this.controller.createRole.bind(this.controller));
    this.router.get('/', this.controller.getPaginated.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
}
