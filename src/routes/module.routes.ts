import { Router } from 'express';
import { ModuleController } from '../infrastructure/controller/module.controller';

export class ModuleRoutes {
  private router: Router;
  private controller: ModuleController

  constructor(moduleController: ModuleController) {
    this.router = Router();
    this.controller = moduleController;
    this.router.put('/', this.controller.updateModule.bind(this.controller));
    this.router.post('/', this.controller.createModule.bind(this.controller));
    this.router.get('/', this.controller.getPaginated.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.delete('/:id', this.controller.softDelete.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
}
