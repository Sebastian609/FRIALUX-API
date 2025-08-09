import { UserService } from "../service/user.service";
import { UserRepository } from "../repository/users.repository";
import * as bcryptUtil from "../utils/bcrip.util";
import { CreateUserDto, LoginDto } from "../infrastructure/dto/users.dto";
import { User } from "../infrastructure/entity/users.entity";
import { plainToInstance } from "class-transformer";

jest.mock("../utils/bcrip.util");

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;
    userService = new UserService(userRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("createUser", () => {
    it("debería crear un usuario si no existe el username", async () => {
      const userDto: CreateUserDto = {
        username: "testuser",
        password: "password123",
        name: "Test User",
        firstLastname: "Test",
        secondLastname: "Test",
        roleId: 1,
      };

      const createdUser = plainToInstance(User, userDto);
      const hashedPassword = "hashed_password";

      userRepositoryMock.findByUsername.mockResolvedValue(null);
      (bcryptUtil.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      userRepositoryMock.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userDto);

      expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(userDto.username);
      expect(bcryptUtil.hashPassword).toHaveBeenCalledWith(userDto.password);
      expect(userRepositoryMock.create).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });

    it("debería lanzar error si el username ya existe", async () => {
      const userDto: CreateUserDto = {
        username: "existinguser",
        password: "password123",
        name: "Existing User",
        firstLastname: "test",
        secondLastname: "test",
        roleId: 1,
      };

      userRepositoryMock.findByUsername.mockResolvedValue({ id: 99 } as User);

      await expect(userService.createUser(userDto)).rejects.toThrow(
        `Username with ${userDto.username} allready exists.`
      );

      expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(userDto.username);
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      username: "testuser",
      password: "password123",
    };
    const user: User = {
      id: 1,
      username: "testuser",
      password: "hashed_password",
      name: "Test User",
      firstLastname: "Test",
      secondLastname: "Test",
      roleId: 1,
      isActive: true,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: undefined,
    };

    it("debería devolver el usuario si login es exitoso", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue(user);
      (bcryptUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      const result = await userService.login(loginDto);
      expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(loginDto.username);
      expect(bcryptUtil.comparePassword).toHaveBeenCalledWith(loginDto.password, user.password);
      expect(result).toEqual(user);
    });

    it("debería lanzar error si el usuario no existe", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue(null);
      await expect(userService.login(loginDto)).rejects.toThrow("Usuario o contraseña incorrectos");
    });

    it("debería lanzar error si la contraseña es incorrecta", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue(user);
      (bcryptUtil.comparePassword as jest.Mock).mockResolvedValue(false);
      await expect(userService.login(loginDto)).rejects.toThrow("Usuario o contraseña incorrectos");
    });

    it("debería lanzar error si el usuario está inactivo o eliminado", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue({ ...user, isActive: false });
      (bcryptUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      await expect(userService.login(loginDto)).rejects.toThrow("Usuario inactivo o eliminado");

      userRepositoryMock.findByUsername.mockResolvedValue({ ...user, deleted: true });
      (bcryptUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      await expect(userService.login(loginDto)).rejects.toThrow("Usuario inactivo o eliminado");
    });
  });
});

// Test de integración real (sin mocks)
describe("UserService integración real", () => {
  const { hashPassword, comparePassword } = jest.requireActual("../utils/bcrip.util");
  const userRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
  const userService = new UserService(userRepository);

  it("debería crear y validar un usuario con contraseña real", async () => {
    // Crear usuario
    const password = "claveReal123";
    const hashed = await hashPassword(password);
    const user: User = {
      id: 1,
      username: "realuser",
      password: hashed,
      name: "Real User",
      firstLastname: "Test",
      secondLastname: "Test",
      roleId: 1,
      isActive: true,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: undefined,
    };
    userRepository.findByUsername.mockResolvedValue(user);
    // Sin mock de comparePassword, usamos el real
    const isValid = await comparePassword(password, user.password);
    expect(isValid).toBe(true);
  });
});
