import { NotificationService } from "../service/notification.service";
import { NotificationRepository } from "../repository/notification.repository";
import { Notification } from "../infrastructure/entity/notification.entity";

describe("NotificationService", () => {
  let notificationService: NotificationService;
  let notificationRepositoryMock: jest.Mocked<NotificationRepository>;

  beforeEach(() => {
    notificationRepositoryMock = {
      create: jest.fn(),
      createMany: jest.fn(),
      getPaginated: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<NotificationRepository>;
    notificationService = new NotificationService(notificationRepositoryMock);
  });

  it("debería crear una notificación", async () => {
    const notification: Notification = { id: 1 } as any;
    notificationRepositoryMock.create.mockResolvedValue(notification);
    const result = await notificationService.createNotification(notification);
    expect(result).toEqual(notification);
  });

  it("debería crear muchas notificaciones", async () => {
    const notifications: Notification[] = [{ id: 1 } as any];
    notificationRepositoryMock.createMany.mockResolvedValue(notifications);
    const result = await notificationService.createMany(notifications);
    expect(result).toEqual(notifications);
  });

  it("debería paginar notificaciones", async () => {
    notificationRepositoryMock.getPaginated.mockResolvedValue([{}]);
    notificationRepositoryMock.count.mockResolvedValue(1);
    const result = await notificationService.getPaginated(0, 10);
    expect(result.pagination.totalItems).toBe(1);
  });
}); 