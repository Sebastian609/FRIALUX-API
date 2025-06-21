import { Router } from 'express';
import { NotificationController } from '../infrastructure/controller/notification.controller';

export class NotificationRoutes {
  private router: Router;
  private controller: NotificationController

  constructor(notificationController: NotificationController) {
    this.router = Router();
    this.controller = notificationController;
    this.router.put('/', this.controller.updateNotification.bind(this.controller));
    this.router.get('/', this.controller.getPaginated.bind(this.controller));
    this.router.get('/module', this.controller.getByModuleRoom.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.delete('/:id', this.controller.softDelete.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
}
