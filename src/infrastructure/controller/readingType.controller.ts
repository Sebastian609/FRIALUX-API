import { Request, Response } from "express";
import { validate } from "class-validator";
import {
  CreateReadingTypeDto,
  UpdateReadingTypeDto,
} from "../dto/readingType.dto";
import { ReadingTypeService } from "../../service/readingType.service";
import { plainToInstance } from "class-transformer";
import { PaginationDto } from "../dto/paginate.dto";
import { ReadingType } from "../entity/readingType.entity";

export class ReadingTypeController {
  private readonly readingTypeService: ReadingTypeService;

  constructor(service: ReadingTypeService) {
    this.readingTypeService = service;
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const readingTypeId = id as unknown as number;
      const readingType = await this.readingTypeService.softDelete(
        readingTypeId
      );
      res.status(200).json(readingType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const readingTypeId = id as unknown as number;

      const readingType = await this.readingTypeService.getReadingTypeById(
        readingTypeId
      );
      res.status(200).json(readingType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response):Promise<void> {
    try {
      const readingTypes: ReadingType[] = await this.readingTypeService.getAll();
      res.status(200).json(readingTypes);
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

      const result = await this.readingTypeService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createReadingType(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateReadingTypeDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) throw Error("invalid");
      const newReadingType = await this.readingTypeService.createReadingType(
        dto
      );
      return res.status(201).json(newReadingType);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateReadingType(req: Request, res: Response) {
    try {
      const data: UpdateReadingTypeDto = req.body;
      const newReadingType = await this.readingTypeService.update(data);
      res.status(201).json(newReadingType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
