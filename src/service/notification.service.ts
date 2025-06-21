import { plainToInstance } from "class-transformer";
import { Notification } from "../infrastructure/entity/notification.entity";
import {
  UpdateNotificationDto,
} from "../infrastructure/dto/notification.dto";
import { NotificationRepository } from "../repository/notification.repository";

export class NotificationService {
  constructor(
    private readonly NotificationRepository: NotificationRepository
  ) {}

  async getNotificationById(id: number): Promise<Notification> {
    return this.NotificationRepository.findById(id);
  }

  async createNotification(notification: Notification): Promise<Notification> {
    return this.NotificationRepository.create(notification);
  }

  async update(notificationData: UpdateNotificationDto): Promise<Notification> {
    const dto = plainToInstance(UpdateNotificationDto, notificationData, {
      excludeExtraneousValues: true,
    });
    return this.NotificationRepository.update(dto.id, dto);
  }

  async softDelete(id: number) {
    const exists = await this.NotificationRepository.findById(id);

    if (!exists) {
      throw new Error("El Modulo no existe");
    }
    return await this.NotificationRepository.softDelete(id);
  }

  async createMany(notifications: Notification[]) {
    const created = plainToInstance(Notification, notifications);
    const saved = await this.NotificationRepository.createMany(created);
    return saved;
  }

  async getByModuleRoom(page: number, itemsPerPage: number, room: string) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;
    const items = await this.NotificationRepository.findByModuleRoom(room, limit, offset);
    return {
      response: items.data,
      pagination: {
        currentPage: page,
        itemsPerPage,
        hasNextPage: (page + 1) * itemsPerPage < items.count,
        hasPreviousPage: page > 0,
      },
    };
  }

  async getPaginated(page: number, itemsPerPage: number) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;

    const [items, totalCount] = await Promise.all([
      this.NotificationRepository.getPaginated(limit, offset),
      this.NotificationRepository.count({ deleted: false }),
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
