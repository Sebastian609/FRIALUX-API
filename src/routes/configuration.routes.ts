import { Router } from 'express';
import { ConfigurationController } from '../infrastructure/controller/configuration.controller';

export class ConfigurationRoutes {
  private router: Router;
  private controller: ConfigurationController

  constructor(configurationController: ConfigurationController) {
    this.router = Router();
    this.controller = configurationController;
    this.router.put('/', this.controller.updateConfiguration.bind(this.controller));
    this.router.post('/', this.controller.createConfiguration.bind(this.controller));
    this.router.get('/', this.controller.getPaginated.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.get('/module/:id', this.controller.getByModuleId.bind(this.controller));
    this.router.delete('/:id', this.controller.softDelete.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
}
