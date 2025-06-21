import { ReadingRepository } from "../repository/reading.repository";
import { plainToInstance } from "class-transformer";
import { Reading } from "../infrastructure/entity/reading.entity";
import {
  CreateReadingDto,
  UpdateReadingDto,
  CreateRaingsBatchDto,
  SendReadingDto,
} from "../infrastructure/dto/reading.dto";
import { ConfigurationService } from "./configuration.service";
import { Notification } from "../infrastructure/entity/notification.entity";
import { Configuration } from "../infrastructure/entity/configuration.entity";
import { SocketService } from "./socket.service";
import { NotificationService } from "./notification.service";

export class ReadingService {
  constructor(
    private readonly ReadingRepository: ReadingRepository,
    private readonly ConfigurationService: ConfigurationService,
    private readonly SocketService: SocketService,
    private readonly NotificationService: NotificationService
  ) {}

  async getReadingById(id: number): Promise<Reading> {
    return this.ReadingRepository.findById(id);
  }

  async getAll(): Promise<Reading[]> {
    return this.ReadingRepository.findAll();
  }

  async createReadingOnBatch(batch: CreateRaingsBatchDto): Promise<void> {
    const readingsToCreate: Reading[] = [];
    const notifications: Notification[] = [];
    const readingToSend: SendReadingDto[] = [];

    const configCache = new Map<number, Configuration>();

    for (const reading of batch.readings) {
      let configuration = configCache.get(reading.readingTypeId);

      if (!configuration) {
        configuration =
          await this.ConfigurationService.findByReadingTypeAndWebSocket(
            reading.readingTypeId,
            batch.webSocketRoom
          );

        configCache.set(reading.readingTypeId, configuration);
      }

      const newReading = new Reading();
      newReading.configurationId = configuration.id;
      newReading.value = reading.value;
      readingsToCreate.push(newReading);

      readingToSend.push({
        reading: configuration.readingType,
        readingTypeId: configuration.readingTypeId,
        value: reading.value,
      })
    }

    const savedReadings = await this.ReadingRepository.createMany(
      readingsToCreate
    );

    for (const savedReading of savedReadings) {
      const config = configCache.get(savedReading.configuration.readingTypeId);

      if (!config) continue;

      const numericSavedValue = parseFloat(savedReading.value as any);
      const numericMaxValue = parseFloat(config.maxValue as any);
      const numericMinValue = parseFloat(config.minValue as any);

      if (
        isNaN(numericSavedValue) ||
        isNaN(numericMaxValue) ||
        isNaN(numericMinValue)
      ) {
        console.error(
          "Uno de los valores no pudo ser convertido a número. Saltando notificación para esta lectura."
        );
        continue;
      }

      const roundedSavedValue = parseFloat(numericSavedValue.toFixed(3));
      const roundedMaxValue = parseFloat(numericMaxValue.toFixed(3));
      const roundedMinValue = parseFloat(numericMinValue.toFixed(3));

      if (roundedSavedValue > roundedMaxValue) {
        notifications.push(
          this.createNotification(
            savedReading.id,
            `Valor por encima del límite: ${savedReading.value} > ${config.maxValue} en modulo ${config.module.name}`
          )
        );
      }

      if (roundedSavedValue < roundedMinValue) {
        notifications.push(
          this.createNotification(
            savedReading.id,
            `Valor por debajo del mínimo: ${savedReading.value} < ${config.minValue} en modulo ${config.module.name}`
          )
        );
      }
    }

    if (notifications.length > 0) {
      await this.NotificationService.createMany(notifications);
      this.SocketService.sendNotifications(notifications);
    }

    if (readingToSend.length > 0) {
      this.SocketService.sendReadings(readingToSend, batch.webSocketRoom);
    }
  }

  // Método auxiliar para crear notificaciones
  private createNotification(readingId: number, message: string): Notification {
    const notification = new Notification();
    notification.readingId = readingId;
    notification.message = message;
    return notification;
  }

  async createReading(readingData: CreateReadingDto): Promise<Reading> {
    const reading = plainToInstance(Reading, readingData);
    return this.ReadingRepository.create(reading);
  }

  async update(readingData: UpdateReadingDto): Promise<Reading> {
    const reading = plainToInstance(Reading, readingData);
    return this.ReadingRepository.update(reading.id, reading);
  }

  async softDelete(id: number) {
    const exists = await this.ReadingRepository.findById(id);

    if (!exists) {
      throw new Error("El Modulo no existe");
    }
    return await this.ReadingRepository.softDelete(id);
  }

  async findLast24HoursByModuleAndReadingTypeId(
    readingTypeId: number,
    ws: string
  ) {
    return this.ReadingRepository.findLast24HoursByModuleAndReadingTypeId(
      ws,
      readingTypeId
    );
  }

  async getPaginated(page: number, itemsPerPage: number) {
    const offset = page * itemsPerPage;
    const limit = itemsPerPage;

    const [items, totalCount] = await Promise.all([
      this.ReadingRepository.getPaginated(limit, offset),
      this.ReadingRepository.count({ deleted: false }),
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
