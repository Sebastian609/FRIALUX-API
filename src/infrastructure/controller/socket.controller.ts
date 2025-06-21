import { Request, Response } from "express";
import { SocketService } from "../../service/socket.service";
import { Message } from "../../model/message.model";

export class SocketController {
  private service: SocketService;

  constructor(io: any) {
    this.service = new SocketService(io);
  }


}
