import { Request, Response } from "express";
import { validate } from "class-validator";
import { CreateNotificationDto, UpdateNotificationDto } from "../dto/notification.dto";
import { NotificationService } from "../../service/notification.service";
import { plainToInstance } from "class-transformer";
import { PaginationDto, PaginationNotificationDto } from "../dto/paginate.dto";

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(service: NotificationService) {
    this.notificationService = service;
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notificationId = id as unknown as number;

      const notification = await this.notificationService.softDelete(notificationId);
      res.status(200).json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notificationId = id as unknown as number;

      const notification = await this.notificationService.getNotificationById(notificationId);
      res.status(200).json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const dto = plainToInstance(PaginationDto, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) throw Error("invalid");
      const parsedPage = Number(dto.page) - 1;
      const parsedItems = Number(dto.items);

      if (parsedPage < 0) {
        throw new Error("Wrong data");
      }

      const result = await this.notificationService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByModuleRoom(req: Request, res: Response) {
    try {
      const dto = plainToInstance(PaginationNotificationDto, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) throw Error("invalid");
      const parsedPage = Number(dto.page) - 1;
      const parsedItems = Number(dto.items);

      if (parsedPage < 0) {
        throw new Error("Wrong data");
      }

      const result = await this.notificationService.getByModuleRoom(
        parsedPage,
        parsedItems,
        dto.room
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateNotification(req: Request, res: Response) {
    try {
      const data: UpdateNotificationDto = req.body;
      const newNotification = await this.notificationService.update(data);
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
