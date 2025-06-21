import { Request, Response } from "express";
import { validate } from "class-validator";
import {
  CreateConfigurationDto,
  UpdateConfigurationDto,
} from "../dto/configuration.dto";
import { ConfigurationService } from "../../service/configuration.service";
import { plainToInstance } from "class-transformer";
import { PaginationConfigurationDto, PaginationDto } from "../dto/paginate.dto";
import { Configuration } from "../entity/configuration.entity";

export class ConfigurationController {
  private readonly configurationService: ConfigurationService;

  constructor(service: ConfigurationService) {
    this.configurationService = service;
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configurationId = id as unknown as number;

      const configuration = await this.configurationService.softDelete(
        configurationId
      );
      res.status(200).json(configuration);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configurationId = id as unknown as number;

      const configuration =
        await this.configurationService.getConfigurationById(configurationId);
      res.status(200).json(configuration);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByModuleId(req: Request, res: Response) {
    try {
      const id: number = req.params.id as unknown as number;
      if(!id) throw new Error("invalid")

      const configurations: Configuration[] = await 
        await this.configurationService.getConfigurationByModuleId(id);
      res.status(200).json(module);
    } catch (error) {
      res.status(400).json({ message: error.message });
    } 
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const dto = plainToInstance(PaginationConfigurationDto, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) throw Error("invalid");
      const parsedPage = Number(dto.page) - 1;
      const parsedItems = Number(dto.items);

      if (parsedPage < 0) {
        throw new Error("Wrong data");
      }

      const result = await this.configurationService.getPaginated(
        parsedPage,
        parsedItems,
        dto.id
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createConfiguration(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateConfigurationDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new Error("invalid");
      }
      let newConfiguration = new Configuration();

      newConfiguration = await this.configurationService.createConfiguration(
        dto
      );

      return res.status(201).json(newConfiguration);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateConfiguration(req: Request, res: Response) {
    try {
      const data: UpdateConfigurationDto = req.body;
      const newConfiguration = await this.configurationService.update(data);
      res.status(201).json(newConfiguration);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
