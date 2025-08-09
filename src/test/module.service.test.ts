import { ModuleService } from "../service/module.service";
import { ModuleRepository } from "../repository/modules.repository";
import { Module } from "../infrastructure/entity/module.entity";
import { CreateModuleDto } from "../infrastructure/dto/module.dto";
import { plainToInstance } from "class-transformer";

describe("ModuleService", () => {
  let moduleService: ModuleService;
  let moduleRepositoryMock: jest.Mocked<ModuleRepository>;

  beforeEach(() => {
    moduleRepositoryMock = {
      findById: jest.fn(),
      getPaginated: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findByWebSocketRoom: jest.fn(),
    } as unknown as jest.Mocked<ModuleRepository>;
    moduleService = new ModuleService(moduleRepositoryMock);
  });

  it("debería obtener un módulo por id", async () => {
    const module: Module = { id: 1, name: "mod", webSocketRoom: "room", configurations: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    moduleRepositoryMock.findById.mockResolvedValue(module);
    const result = await moduleService.getModuleById(1);
    expect(result).toEqual(module);
  });

  it("debería paginar módulos", async () => {
    moduleRepositoryMock.getPaginated.mockResolvedValue([{}]);
    moduleRepositoryMock.count.mockResolvedValue(1);
    const result = await moduleService.getPaginated(0, 10);
    expect(result.pagination.totalItems).toBe(1);
  });

  it("debería crear un módulo si no hay colisión de room", async () => {
    const dto: CreateModuleDto = { name: "mod" } as any;
    moduleRepositoryMock.findByWebSocketRoom.mockResolvedValue(undefined);
    const created = { id: 1, ...dto } as Module;
    moduleRepositoryMock.create.mockResolvedValue(created);
    const result = await moduleService.createModule(dto);
    expect(result).toEqual(created);
  });
}); 