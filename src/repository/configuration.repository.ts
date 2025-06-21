import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Configuration } from "../infrastructure/entity/configuration.entity";
import { IBaseRepository } from "./base-repository.interface";

export class ConfigurationRepository implements IBaseRepository<Configuration> {
  public constructor(private repository: Repository<Configuration>) {
    this.repository = repository;
  }

  async getPaginated(limit: number, offset: number, id: number): Promise<any> {
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
        moduleId: id
      },
      relations: {
        readingType: true
      }
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

  async findAll(): Promise<Configuration[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Configuration> {
    const Configuration: Promise<Configuration> = this.repository.findOne({
        where: {id},
        relations: ['module','readingType']
    });
    if (!Configuration) {
      throw new Error(`Configuration with ID ${id} not found`);
    }
    return Configuration;
  }

  async findByCriteria(criteria: Partial<Configuration>): Promise<Configuration[]> {
    return this.repository.find({ where: criteria });
  }

  async create(entity: Configuration): Promise<Configuration> {
    const configuration = this.repository.create(entity);
    return this.repository.save(configuration);
  }

  async update(id: number, entity: Partial<Configuration>): Promise<Configuration> {
    await this.repository.update(id, entity);
    const updatedConfiguration = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedConfiguration;
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

  async count(criteria?: Partial<Configuration>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

  async findByModuleId(moduleId: number){
    return this.repository.findBy({moduleId: moduleId});
  }

  async findByReadingTypeAndModule(readingTypeId: number, moduleId: number): Promise<Configuration> {
  return this.repository
    .createQueryBuilder('configuration')
    .where('configuration.readingTypeId = :readingTypeId', { readingTypeId })
    .andWhere('configuration.moduleId = :moduleId', { moduleId })
    .andWhere('configuration.deleted = false')
    .getOne();
}


async findByReadingTypeAndWebSocket(readingTypeId: number, socketRoom: string): Promise<Configuration> {
  return this.repository
    .createQueryBuilder('configuration')
    .leftJoinAndSelect('configuration.module', 'module')
    .where('configuration.readingTypeId = :readingTypeId', { readingTypeId })
    .andWhere('module.webSocketRoom = :socketRoom', { socketRoom })
    .andWhere('module.deleted = false')
    .andWhere('module.isActive = true')
    .andWhere('configuration.deleted = false')
    .andWhere('configuration.isActive = true')
    .getOne();
}


}