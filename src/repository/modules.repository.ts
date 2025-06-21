import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Module } from "../infrastructure/entity/module.entity";
import { IBaseRepository } from "./base-repository.interface";

export class ModuleRepository implements IBaseRepository<Module> {
  public constructor(private repository: Repository<Module>) {
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
        createdAt: "ASC",
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
      data: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<Module[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Module> {
    const Module = this.repository.findOneBy({ id });
    if (!Module) {
      throw new Error(`Module with ID ${id} not found`);
    }
    return Module;
  }

  async findByCriteria(criteria: Module): Promise<Module[]> {
    return this.repository.find({ where: criteria });
  }

  async findByWebSocketRoom(room: string): Promise<Module> {
    return this.repository.findOne({ where: { webSocketRoom: room } });
  }

  async findByWebSocketRoomActive(
    room: string,
    readingTypeId: number
  ): Promise<Module> {
    return this.repository
      .createQueryBuilder("module")
      .leftJoinAndSelect("module.configurations", "configuration")
      .where("module.webSocketRoom = :room", { room })
      .andWhere("module.isActive = :active", { active: true })
      .andWhere("module.deleted = :deleted", { deleted: false })
      .andWhere("configuration.readingTypeId = :readingTypeId", {
        readingTypeId,
      })
      .andWhere("configuration.isActive = :configActive", {
        configActive: true,
      })
      .andWhere("configuration.deleted = :configDeleted", {
        configDeleted: false,
      })
      .getOneOrFail();
  }

  async create(entity: Module): Promise<Module> {
    const module = this.repository.create(entity);
    return this.repository.save(module);
  }

  async update(id: number, entity: Partial<Module>): Promise<Module> {
    await this.repository.update(id, entity);
    const updatedModule = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedModule;
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

  async count(criteria?: Partial<Module>): Promise<number> {
    return this.repository.count({ where: criteria });
  }
}
