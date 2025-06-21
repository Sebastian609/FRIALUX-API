
// src/repositories/ReadingTypeRepository.ts
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { ReadingType } from "../infrastructure/entity/readingType.entity";
import { IBaseRepository } from "./base-repository.interface";

export class ReadingTypeRepository implements IBaseRepository<ReadingType> {
  public constructor(private repository: Repository<ReadingType>) {
    this.repository = repository;
  }

  async getPaginated(limit: number, offset: number): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }

    const [data] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: "DESC",
      },
      where: {
        deleted: false,
      },
    });
    const count = await this.repository.count({
      where: {
        deleted: false,
      },
    });

    const response = {
      readingTypes: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<ReadingType[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<ReadingType> {
    const ReadingType = this.repository.findOneBy({ id });
    if (!ReadingType) {
      throw new Error(`ReadingType with ID ${id} not found`);
    }
    return ReadingType;
  }

  async findByCriteria(criteria: ReadingType): Promise<ReadingType[]> {
    return this.repository.find({ where: criteria });
  }

  async create(entity: ReadingType): Promise<ReadingType> {
    const readingType = this.repository.create(entity);
    return this.repository.save(readingType);
  }

  async update(id: number, entity: Partial<ReadingType>): Promise<ReadingType> {
    await this.repository.update(id, entity);
    const updatedReadingType = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedReadingType;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.repository.update(id, {
      deleted: true,
    });
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async count(criteria?: Partial<ReadingType>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

}
