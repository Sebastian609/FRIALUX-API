import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketRoutes } from "./routes/socket.routes";
import { SocketController } from "./infrastructure/controller/socket.controller";
import { SocketService } from "./service/socket.service";
import { RolesRoutes } from "./routes/roles.routes";
import { RoleController } from "./infrastructure/controller/roles.controller";
import { UserController } from "./infrastructure/controller/user.controller";
import { UserRoutes } from "./routes/user.routes";
import { UserService } from "./service/user.service";
import { UserRepository } from "./repository/users.repository";
import { User } from "./infrastructure/entity/users.entity";
import { AppDataSource } from "./infrastructure/database/database";
import { ModuleController } from "./infrastructure/controller/module.controller";
import { ModuleService } from "./service/module.service";
import { ModuleRepository } from "./repository/modules.repository";
import { Module } from "./infrastructure/entity/module.entity";
import { ModuleRoutes } from "./routes/module.routes";
import { ReadingTypeRoutes } from "./routes/readingType.routes";
import { ReadingTypeController } from "./infrastructure/controller/readingType.controller";
import { ReadingTypeService } from "./service/readingType.service";
import { ReadingTypeRepository } from "./repository/readingType.repository";
import { ReadingType } from "./infrastructure/entity/readingType.entity";
import { ConfigurationRepository } from "./repository/configuration.repository";
import { ConfigurationService } from "./service/configuration.service";
import { ConfigurationController } from "./infrastructure/controller/configuration.controller";
import { ConfigurationRoutes } from "./routes/configuration.routes";
import { Configuration } from "./infrastructure/entity/configuration.entity";
import { ReadingRoutes } from "./routes/reading.routes";
import { ReadingController } from "./infrastructure/controller/reading.controller";
import { ReadingService } from "./service/reading.service";
import { ReadingRepository } from "./repository/reading.repository";
import { Reading } from "./infrastructure/entity/reading.entity";
import { Not } from "typeorm";
import { NotificationService } from "./service/notification.service";
import { NotificationRepository } from "./repository/notification.repository";
import { Notification } from "./infrastructure/entity/notification.entity";
import { NotificationController } from "./infrastructure/controller/notification.controller";
import { NotificationRoutes } from "./routes/notification.routes";
import authRoutes from "./routes/auth.routes";
import cors from 'cors';

const PORT = 2224;
const app = express();
const httpServer = createServer(app);
app.use(cors({
  origin: true,          // o una lista como ['http://localhost:1420']
  credentials: true
}));
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const socketService = new SocketService(io);
const socketController = new SocketController(io);
const socketRoutes = new SocketRoutes(socketController);

const notificationService = new NotificationService(
  new NotificationRepository(AppDataSource.getRepository(Notification))
);
const roleRoutes = new RolesRoutes(new RoleController());

const userRoutes = new UserRoutes(
  new UserController(
    new UserService(new UserRepository(AppDataSource.getRepository(User)))
  )
);

const moduleRoutes = new ModuleRoutes(
  new ModuleController(
    new ModuleService(
      new ModuleRepository(AppDataSource.getTreeRepository(Module))
    )
  )
);

const configurationService = new ConfigurationService(
  new ConfigurationRepository(AppDataSource.getTreeRepository(Configuration))
);
const readingTypeRoutes = new ReadingTypeRoutes(
  new ReadingTypeController(
    new ReadingTypeService(
      new ReadingTypeRepository(AppDataSource.getTreeRepository(ReadingType))
    )
  )
);

const configurationRoutes = new ConfigurationRoutes(
  new ConfigurationController(
    new ConfigurationService(
      new ConfigurationRepository(
        AppDataSource.getTreeRepository(Configuration)
      )
    )
  )
);

const readingRoutes = new ReadingRoutes(
  new ReadingController(
    new ReadingService(
      new ReadingRepository(AppDataSource.getTreeRepository(Reading)),
      configurationService,
      socketService,
      notificationService
    )
  )
);

const notificationRouters = new NotificationRoutes(
  new NotificationController(
    notificationService
  )
)

app.use(express.json());
app.use("/api/ws", socketRoutes.getRoutes());
app.use("/api/roles", roleRoutes.getRoutes());
app.use("/api/users", userRoutes.getRoutes());
app.use("/api/modules", moduleRoutes.getRoutes());
app.use("/api/reading-types", readingTypeRoutes.getRoutes());
app.use("/api/configurations", configurationRoutes.getRoutes());
app.use("/api/readings", readingRoutes.getRoutes());
app.use("/api/notifications", notificationRouters.getRoutes());
app.use("/api/auth", authRoutes);

io.on("connection", (socket) => {
  socketService.handleConnection(socket);
});

httpServer.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
