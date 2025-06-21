import { ReadingTypeRepository } from "../repository/readingType.repository";
import {
  CreateReadingTypeDto,
  UpdateReadingTypeDto,
} from "../infrastructure/dto/readingType.dto";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { ReadingType } from "../infrastructure/entity/readingType.entity";

export class ReadingTypeService {
  constructor(private readonly ReadingTypeRepository: ReadingTypeRepository) {}

  async getReadingTypeById(id: number): Promise<ReadingType> {
    return this.ReadingTypeRepository.findById(id);
  }

   async getAll(): Promise<ReadingType[]> {
    return this.ReadingTypeRepository.findAll()
  }

  async createReadingType(readingTypeData: CreateReadingTypeDto): Promise<ReadingType> {
    const readingType = plainToInstance(ReadingType, readingTypeData);
    return this.ReadingTypeRepository.create(readingType);
  }

  async update(readingTypeData: UpdateReadingTypeDto): Promise<ReadingType> {
    const readingType = plainToInstance(ReadingType, readingTypeData);
    return this.ReadingTypeRepository.update(readingType.id, readingType);
  }

  async softDelete(id: number) {
    const exists = await this.ReadingTypeRepository.findById(id);

    if (!exists) {
      throw new Error("El Modulo no existe");
    }
    return await this.ReadingTypeRepository.softDelete(id);
  }

  async getPaginated(page: number, itemsPerPage: number) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;

    const [items, totalCount] = await Promise.all([
      this.ReadingTypeRepository.getPaginated(limit, offset),
      this.ReadingTypeRepository.count({ deleted: false }),
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
