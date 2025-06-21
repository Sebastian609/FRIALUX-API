// src/service/socket.service.ts
import { Server, Socket } from "socket.io";
import { Message } from "../model/message.model";
import { ISocketService } from "./ISocketService";
import {  SendReadingDto } from "../infrastructure/dto/reading.dto";
import { Notification } from "../infrastructure/entity/notification.entity";

export class SocketService implements ISocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }


  public sendReadings(readings: SendReadingDto[], wsRoom: string): void {
    readings.forEach((r)=>{
      this.io.emit(wsRoom,r)
    })
  }

  public sendNotifications(notifiacations: Notification[]): void {
    console.log(notifiacations);
    
     notifiacations.forEach((n)=>{
      this.io.emit("notifications",n)
    })
  }

  public handleConnection(socket: Socket): void {
    console.log(`Cliente conectado: ${socket.id}`);
  }

  public broadcastMessage(message: Message): void {
    const messageMetadata = message.getMetadata();
    this.io.emit("broadcast", messageMetadata);
  }
}
