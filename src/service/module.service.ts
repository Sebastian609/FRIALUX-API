// src/services/Module.service.ts
import { ModuleRepository } from "../repository/modules.repository";
import {
  CreateModuleDto,
  UpdateModuleDto,
} from "../infrastructure/dto/module.dto";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { Module } from "../infrastructure/entity/module.entity";

export class ModuleService {
  constructor(private readonly ModuleRepository: ModuleRepository) {}

  async getModuleById(id: number): Promise<Module> {
    return this.ModuleRepository.findById(id);
  }

  async createModule(moduleData: CreateModuleDto): Promise<Module> {
    const module = plainToInstance(Module, moduleData);
    const webSocketRoom = faker.string.alphanumeric(10);
    if (await this.ModuleRepository.findByWebSocketRoom(webSocketRoom))
      throw new Error("colision de datos, intentalo nuevamente");
    module.webSocketRoom = webSocketRoom;
    return this.ModuleRepository.create(module);
  }

  async findByWebSocketRoom(wsRoom: string): Promise<Module> {
    return await this.ModuleRepository.findByWebSocketRoom(wsRoom);
  }

  async findByWebSocketRoomActive(
    wsRoom: string,
    readingTypeId: number
  ): Promise<Module> {
    return await this.ModuleRepository.findByWebSocketRoomActive(
      wsRoom,
      readingTypeId
    );
  }

  async update(moduleData: UpdateModuleDto): Promise<Module> {
    const dto = plainToInstance(UpdateModuleDto, moduleData, {
      excludeExtraneousValues: true,
    });

    if (dto.webSocketRoom) {
      const module = await this.ModuleRepository.findByWebSocketRoom(
        dto.webSocketRoom
      );

      if (module && dto.id != module.id) {
        throw new Error("Este codigo ya esta en uso");
      }
    }

    return this.ModuleRepository.update(dto.id, dto);
  }

  async softDelete(id: number) {
    const exists = await this.ModuleRepository.findById(id);

    if (!exists) {
      throw new Error("El Modulo no existe");
    }
    return await this.ModuleRepository.softDelete(id);
  }

  async getPaginated(page: number, itemsPerPage: number) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;

    const [items, totalCount] = await Promise.all([
      this.ModuleRepository.getPaginated(limit, offset),
      this.ModuleRepository.count({ deleted: false }),
    ]);
    return {
      response: items,
      pagination: {
        currentPage: page,
        itemsPerPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        hasNextPage: (page + 1) * itemsPerPage < totalCount,
        hasPreviousPage: page > 0,
      },
    };
  }
}
