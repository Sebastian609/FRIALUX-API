import { Router } from 'express';
import { ReadingTypeController } from '../infrastructure/controller/readingType.controller';

export class ReadingTypeRoutes {
  private router: Router;
  private controller: ReadingTypeController

  constructor(readingTypeController: ReadingTypeController) {
    this.router = Router();
    this.controller = readingTypeController;
    this.router.put('/', this.controller.updateReadingType.bind(this.controller));
    this.router.post('/', this.controller.createReadingType.bind(this.controller));
    this.router.get('/', this.controller.getPaginated.bind(this.controller));
    this.router.get('/list', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.delete('/:id', this.controller.softDelete.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
}
