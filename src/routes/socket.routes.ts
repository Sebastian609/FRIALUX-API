import { Router } from 'express';
import { SocketController } from '../infrastructure/controller/socket.controller';

export class SocketRoutes {
  private router: Router;
  private socketController: SocketController;

  constructor(socketController: SocketController) {
    this.router = Router();
    this.socketController = socketController;
  }

  public getRoutes(): Router {
    return this.router;
  }
}
