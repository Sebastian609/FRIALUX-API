// src/services/Configuration.service.ts
import { ConfigurationRepository } from "../repository/configuration.repository";
import {
  CreateConfigurationDto,
  UpdateConfigurationDto,
} from "../infrastructure/dto/configuration.dto";
import { plainToInstance } from "class-transformer";
import { Configuration } from "../infrastructure/entity/configuration.entity";

export class ConfigurationService {
  constructor(
    private readonly ConfigurationRepository: ConfigurationRepository
  ) {}

  async getConfigurationById(id: number): Promise<Configuration> {
    return this.ConfigurationRepository.findById(id);
  }

  async createConfiguration(
    configurationData: CreateConfigurationDto
  ): Promise<Configuration> {
    const configuration = plainToInstance(Configuration, configurationData);

      
    if (configuration.minValue >= configuration.maxValue)
      throw new Error(
        "El valor minimo no puede ser menor o igual al valor maximo"
      );

    const existing = await this.ConfigurationRepository.findByReadingTypeAndModule(
      configuration.readingTypeId,configuration.moduleId
    );

    if (existing) {
      throw new Error(
        "Ya existe una configuración para este módulo y tipo de lectura"
      );
    }

    return this.ConfigurationRepository.create(configuration);
  }

  async update(
    configurationData: UpdateConfigurationDto
  ): Promise<Configuration> {
    const configuration = plainToInstance(Configuration, configurationData);
    const existing = await this.ConfigurationRepository.findByReadingTypeAndModule(
      configuration.readingTypeId,configuration.moduleId
    );

    if(configuration.minValue>= configuration.maxValue){
      throw new Error(
        "El valor minimo no puede ser mayor o igual que el valor máximo 🧊 🤔"
      )
    }

    if (existing && existing.id !== configuration.id && !existing.deleted) {
      throw new Error(
        "Ya existe una configuración para este módulo y tipo de lectura 🌡️😡"
      );  
    }
    return this.ConfigurationRepository.update(configuration.id, configuration);
  }

  async softDelete(id: number) {

    const exists = await this.ConfigurationRepository.findById(id);

    if (!exists) {
      throw new Error("El Modulo no existe");
    }
    return await this.ConfigurationRepository.softDelete(id);
  }

  
  async getConfigurationByModuleId(moduleId: number){
    return await this.ConfigurationRepository.findByModuleId(moduleId)
  }
   async findByReadingTypeAndWebSocket(readingTypeId: number, ws:string){
    return await this.ConfigurationRepository.findByReadingTypeAndWebSocket(readingTypeId,ws)
  }

  async getPaginated(page: number, itemsPerPage: number, id: number) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;
  

      const [items, totalCount] = await Promise.all([
      this.ConfigurationRepository.getPaginated(limit, offset,id),
      this.ConfigurationRepository.count({ deleted: false }),
    ]);
    return {
      response: items,
      pagination: {
        currentPage: page,
        itemsPerPage,
        totalItems: items.totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        hasNextPage: (page + 1) * itemsPerPage < items.totalCount,
        hasPreviousPage: page > 0,
      },
    };
  }
}
