import { Router } from 'express';
import { ReadingController } from '../infrastructure/controller/reading.controller';

export class ReadingRoutes {
  private router: Router;
  private controller: ReadingController

  constructor(readingController: ReadingController) {
    this.router = Router();
    this.controller = readingController;
    
    this.router.post('/', this.controller.createReadingOnBatch.bind(this.controller));
    
    this.router.get('/last-24', this.controller.getLast24HoursByModuleIdAndReadingTypeId.bind(this.controller));
   
  }

  public getRoutes(): Router {
    return this.router;
  }
}
