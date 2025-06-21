
// src/repositories/ReadingRepository.ts
import { Repository, DeleteResult, UpdateResult, In } from "typeorm";
import { Reading } from "../infrastructure/entity/reading.entity";

import { IBaseRepository } from "./base-repository.interface";

export class ReadingRepository implements IBaseRepository<Reading> {
  public constructor(private repository: Repository<Reading>) {
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
      readings: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<Reading[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Reading> {
    const Reading = this.repository.findOneBy({ id });
    if (!Reading) {
      throw new Error(`Reading with ID ${id} not found`);
    }
    return Reading;
  }

async createMany(entities: Reading[]): Promise<Reading[]> {
  const created = this.repository.create(entities);
  const saved = await this.repository.save(created);

  const ids = saved.map(r => r.id);

  return this.repository.find({
    where: { id: In(ids) },
    relations: ['configuration'],
  });
}


  async findByCriteria(criteria: Reading): Promise<Reading[]> {
    return this.repository.find({ where: criteria });
  }

  async findLast24HoursByModuleAndReadingTypeId(room: string, readingTypeId: number): Promise<Reading[]> {
    return this.repository
      .createQueryBuilder("reading")
      .innerJoin("reading.configuration", "configuration")
      .innerJoin("configuration.module", "module")
      .where("reading.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")
      .andWhere("module.webSocketRoom = :room", { room: room })
      .andWhere("configuration.readingTypeId = :readingTypeId", { readingTypeId: readingTypeId })
      .getMany();
  }

  async create(entity: Reading): Promise<Reading> {
    const reading = this.repository.create(entity);
    return this.repository.save(reading);
  }

  async update(id: number, entity: Partial<Reading>): Promise<Reading> {
    await this.repository.update(id, entity);
    const updatedReading = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedReading;
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

  async count(criteria?: Partial<Reading>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

}
