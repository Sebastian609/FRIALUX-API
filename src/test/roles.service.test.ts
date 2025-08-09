import { RoleService } from "../service/roles.service";
import { RoleRepository } from "../repository/roles.repository";
import { Role } from "../infrastructure/entity/roles.entity";
import { CreateRoleDto, UpdateRoleDto } from "../infrastructure/dto/roles.dto";
import { DeleteResult } from "typeorm";

describe("RoleService", () => {
  let roleService: RoleService;
  let roleRepositoryMock: jest.Mocked<RoleRepository> & {
    findById: jest.Mock;
    activateRole: jest.Mock;
    deactivateRole: jest.Mock;
  };

  beforeEach(() => {
    roleRepositoryMock = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      activateRole: jest.fn(),
      deactivateRole: jest.fn(),
    } as any;
    roleService = new RoleService();
    (roleService as any).roleRepository = roleRepositoryMock;
  });

  it("debería obtener todos los roles", async () => {
    const roles: Role[] = [{ id: 1, name: "admin", createdAt: new Date(), updatedAt: new Date(), isActive: true, users: [] }];
    roleRepositoryMock.findAll.mockResolvedValue(roles);
    const result = await roleService.getAllRoles();
    expect(result).toEqual(roles);
  });

  it("debería crear un rol si no existe", async () => {
    const dto: CreateRoleDto = { name: "admin" } as any;
    roleRepositoryMock.findByName.mockResolvedValue(undefined);
    const created = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date(), isActive: true, users: [] } as Role;
    roleRepositoryMock.create.mockResolvedValue(created);
    const result = await roleService.createRole(dto);
    expect(result).toEqual(created);
  });

  it("debería actualizar un rol", async () => {
    const dto: UpdateRoleDto = { id: 1, name: "admin" } as any;
    const updated = { id: 1, name: "admin", createdAt: new Date(), updatedAt: new Date(), isActive: true, users: [] };
    roleRepositoryMock.findById.mockResolvedValue(updated);
    roleRepositoryMock.update.mockResolvedValue(updated);
    const result = await roleService.updateRole(1, dto);
    expect(result).toEqual(updated);
  });

  it("debería eliminar un rol", async () => {
    roleRepositoryMock.delete.mockResolvedValue({ affected: 1 } as DeleteResult);
    await expect(roleService.deleteRole(1)).resolves.toBeUndefined();
  });

  it("debería activar un rol", async () => {
    roleRepositoryMock.activateRole.mockResolvedValue(true);
    await expect(roleService.activateRole(1)).resolves.toBeUndefined();
  });

  it("debería desactivar un rol", async () => {
    roleRepositoryMock.deactivateRole.mockResolvedValue(true);
    await expect(roleService.deactivateRole(1)).resolves.toBeUndefined();
  });

  it("debería contar roles", async () => {
    roleRepositoryMock.count.mockResolvedValue(5);
    const result = await roleService.countRoles();
    expect(result).toBe(5);
  });
}); 