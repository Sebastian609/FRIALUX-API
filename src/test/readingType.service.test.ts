import { ReadingTypeService } from "../service/readingType.service";
import { ReadingTypeRepository } from "../repository/readingType.repository";
import { ReadingType } from "../infrastructure/entity/readingType.entity";
import { CreateReadingTypeDto } from "../infrastructure/dto/readingType.dto";

describe("ReadingTypeService", () => {
  let readingTypeService: ReadingTypeService;
  let readingTypeRepositoryMock: jest.Mocked<ReadingTypeRepository>;

  beforeEach(() => {
    readingTypeRepositoryMock = {
      findAll: jest.fn(),
      getPaginated: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ReadingTypeRepository>;
    readingTypeService = new ReadingTypeService(readingTypeRepositoryMock);
  });

  it("debería obtener todos los tipos de lectura", async () => {
    const readingType: ReadingType = { id: 1, name: "tipo", simbol: "t", configurations: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingTypeRepositoryMock.findAll.mockResolvedValue([readingType]);
    const result = await readingTypeService.getAll();
    expect(result).toEqual([readingType]);
  });

  it("debería paginar tipos de lectura", async () => {
    const readingType: ReadingType = { id: 1, name: "tipo", simbol: "t", configurations: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingTypeRepositoryMock.getPaginated.mockResolvedValue([readingType]);
    readingTypeRepositoryMock.count.mockResolvedValue(1);
    const result = await readingTypeService.getPaginated(0, 10);
    expect(result.pagination.totalItems).toBe(1);
  });

  it("debería crear un tipo de lectura", async () => {
    const dto: CreateReadingTypeDto = { name: "tipo" } as any;
    const created: ReadingType = { id: 1, name: "tipo", simbol: "t", configurations: [], createdAt: new Date(), updatedAt: new Date(), isActive: true, deleted: false };
    readingTypeRepositoryMock.create.mockResolvedValue(created);
    const result = await readingTypeService.createReadingType(dto);
    expect(result).toEqual(created);
  });
}); 