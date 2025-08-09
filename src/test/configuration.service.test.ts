import { ConfigurationService } from "../service/configuration.service";
import { ConfigurationRepository } from "../repository/configuration.repository";
import { Configuration } from "../infrastructure/entity/configuration.entity";
import { CreateConfigurationDto, UpdateConfigurationDto } from "../infrastructure/dto/configuration.dto";

describe("ConfigurationService", () => {
  let configurationService: ConfigurationService;
  let configurationRepositoryMock: jest.Mocked<ConfigurationRepository>;

  beforeEach(() => {
    configurationRepositoryMock = {
      getPaginated: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findByReadingTypeAndModule: jest.fn(),
    } as unknown as jest.Mocked<ConfigurationRepository>;
    configurationService = new ConfigurationService(configurationRepositoryMock);
  });

  it("debería crear una configuración si no existe", async () => {
    const dto: CreateConfigurationDto = { minValue: 1, maxValue: 2, readingTypeId: 1, moduleId: 1 } as any;
    configurationRepositoryMock.findByReadingTypeAndModule.mockResolvedValue(undefined);
    const created = { id: 1, ...dto, readings: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false, readingType: {} as any, module: {} as any } as Configuration;
    configurationRepositoryMock.create.mockResolvedValue(created);
    const result = await configurationService.createConfiguration(dto);
    expect(result).toEqual(created);
  });

  it("debería actualizar una configuración", async () => {
    const dto: UpdateConfigurationDto = { id: 1, minValue: 1, maxValue: 2, readingTypeId: 1, moduleId: 1 } as any;
    const updated = { id: 1, ...dto, readings: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false, readingType: {} as any, module: {} as any } as Configuration;
    configurationRepositoryMock.update.mockResolvedValue(updated);
    const result = await configurationService.update(dto);
    expect(result).toEqual(updated);
  });


}); 