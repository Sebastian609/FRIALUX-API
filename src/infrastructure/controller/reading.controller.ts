import { Request, Response } from "express";
import { validate } from "class-validator";
import {
  CreateRaingsBatchDto,
  CreateReadingDto,
  UpdateReadingDto,
} from "../dto/reading.dto";
import { ReadingService } from "../../service/reading.service";
import { plainToInstance } from "class-transformer";
import { PaginationDto } from "../dto/paginate.dto";

export class ReadingController {
  private readonly readingService: ReadingService;

  constructor(service: ReadingService) {
    this.readingService = service;
  }

  async getLast24HoursByModuleIdAndReadingTypeId(req: Request, res: Response) {
    try {
      const { readingTypeId, moduleId } = req.query;

      if (!readingTypeId || !moduleId) {
        throw new Error("Missing parameters");
      }

      const result = await this.readingService.findLast24HoursByModuleAndReadingTypeId(
        Number(readingTypeId),
        moduleId as string
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  }

  async createReadingOnBatch(req: Request, res: Response) {
    try {

      
      const dto = plainToInstance(CreateRaingsBatchDto, req.body, {
        excludeExtraneousValues: true,
      });
    
      
      await this.readingService.createReadingOnBatch(dto);
      res.status(200).json({ message: "sended" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const dto = plainToInstance(PaginationDto, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) throw Error("invalid");
      const parsedPage = Number(dto.page) - 1;
      const parsedItems = Number(dto.items);

      if (parsedPage < 0) {
        throw new Error("Wrong data");
      }

      const result = await this.readingService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
