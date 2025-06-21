import { Repository, DeleteResult, UpdateResult, In } from "typeorm";
import { Notification } from "../infrastructure/entity/notification.entity";
import { IBaseRepository } from "./base-repository.interface";
import { w } from "@faker-js/faker/dist/airline-BUL6NtOJ";

export class NotificationRepository implements IBaseRepository<Notification> {
  public constructor(private repository: Repository<Notification>) {
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
        sentAt: "ASC",
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

  async findAll(): Promise<Notification[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Notification> {
    const Notification = this.repository.findOneBy({ id });
    if (!Notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    return Notification;
  }

  async findByCriteria(criteria: Notification): Promise<any> {
    return this.repository.find({ where: criteria });
  }

  async findByModuleRoom(
    room: string,
    limit: number,
    offset: number
  ): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }
    const [data,count] = await this.repository
      .createQueryBuilder("notification")
      .innerJoin("notification.reading", "reading")
      .innerJoin("reading.configuration", "configuration")
      .innerJoin("configuration.module", "module")
      .where("module.webSocketRoom = :room", { room })
      .andWhere("notification.deleted = false")
      .andWhere("notification.isActive = true")
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

     const response = {
      data: data,
      count: count,
    };

    return response;
  }

  async create(entity: Notification): Promise<Notification> {
    const notification = this.repository.create(entity);
    return this.repository.save(notification);
  }

  async createMany(entities: Notification[]): Promise<Notification[]> {
    const created = this.repository.create(entities);
    const saved = await this.repository.save(created);
    const ids = saved.map((r) => r.id);

    return this.repository.find({
      where: { id: In(ids) },
    });
  }

  async update(
    id: number,
    entity: Partial<Notification>
  ): Promise<Notification> {
    await this.repository.update(id, entity);
    const updatedNotification = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedNotification;
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

  async count(criteria?: Partial<Notification>): Promise<number> {
    return this.repository.count({ where: criteria });
  }
}
