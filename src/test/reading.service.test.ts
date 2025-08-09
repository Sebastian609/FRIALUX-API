import { ReadingService } from "../service/reading.service";
import { ReadingRepository } from "../repository/reading.repository";
import { ConfigurationService } from "../service/configuration.service";
import { SocketService } from "../service/socket.service";
import { NotificationService } from "../service/notification.service";
import { Reading } from "../infrastructure/entity/reading.entity";
import { CreateReadingDto, CreateRaingsBatchDto } from "../infrastructure/dto/reading.dto";

describe("ReadingService", () => {
  let readingService: ReadingService;
  let readingRepositoryMock: jest.Mocked<ReadingRepository>;
  let configurationServiceMock: jest.Mocked<ConfigurationService>;
  let socketServiceMock: jest.Mocked<SocketService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;

  beforeEach(() => {
    readingRepositoryMock = {
      findAll: jest.fn(),
      getPaginated: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
    } as unknown as jest.Mocked<ReadingRepository>;
    configurationServiceMock = {} as any;
    socketServiceMock = {} as any;
    notificationServiceMock = {} as any;
    readingService = new ReadingService(readingRepositoryMock, configurationServiceMock, socketServiceMock, notificationServiceMock);
  });

  it("debería obtener todas las lecturas", async () => {
    const reading: Reading = { id: 1, value: 10, configurationId: 1, configuration: {} as any, notification: {} as any, createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingRepositoryMock.findAll.mockResolvedValue([reading]);
    const result = await readingService.getAll();
    expect(result).toEqual([reading]);
  });

  it("debería paginar lecturas", async () => {
    const reading: Reading = { id: 1, value: 10, configurationId: 1, configuration: {} as any, notification: {} as any, createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingRepositoryMock.getPaginated.mockResolvedValue([reading]);
    readingRepositoryMock.count.mockResolvedValue(1);
    const result = await readingService.getPaginated(0, 10);
    expect(result.pagination.totalItems).toBe(1);
  });

  it("debería crear una lectura", async () => {
    const dto: CreateReadingDto = { value: 1 } as any;
    const created: Reading = { id: 1, value: 1, configurationId: 1, configuration: {} as any, notification: {} as any, createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingRepositoryMock.create.mockResolvedValue(created);
    const result = await readingService.createReading(dto);
    expect(result).toEqual(created);
  });

  it("debería crear lecturas en batch", async () => {
    const dto: CreateRaingsBatchDto = { readings: [] } as any;
    const reading: Reading = { id: 1, value: 10, configurationId: 1, configuration: {} as any, notification: {} as any, createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingRepositoryMock.createMany.mockResolvedValue([reading]);
    await expect(readingService.createReadingOnBatch(dto)).resolves.not.toThrow();
  });
}); 