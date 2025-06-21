import { Request, Response } from "express";
import { validate } from "class-validator";
import { CreateModuleDto, UpdateModuleDto } from "../dto/module.dto";
import { ModuleService } from "../../service/module.service";
import { plainToInstance } from "class-transformer";
import { PaginationDto } from "../dto/paginate.dto";

export class ModuleController {
  private readonly moduleService: ModuleService;

  constructor(service: ModuleService) {
    this.moduleService = service;
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const moduleId = id as unknown as number;

      const module = await this.moduleService.softDelete(moduleId);
      res.status(200).json(module);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const moduleId = id as unknown as number;

      const module = await this.moduleService.getModuleById(moduleId);
      res.status(200).json(module);
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

      const result = await this.moduleService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createModule(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateModuleDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) throw Error("invalid");

      const newModule = await this.moduleService.createModule(dto);
      return res.status(201).json(newModule);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateModule(req: Request, res: Response) {
    try {
      const data: UpdateModuleDto = req.body;
      const newModule = await this.moduleService.update(data);
      res.status(201).json(newModule);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
