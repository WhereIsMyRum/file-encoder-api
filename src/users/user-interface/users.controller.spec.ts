import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth';
import { UsersController } from '.';
import { CreateUserDto, UserDto, UserManagementService } from '../application';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UserManagementService;

  const usersDtos: UserDto[] = [
    {
      id: 'id',
      email: 'email',
      password: 'password',
      rsaKeyPair: { publicKey: 'pub', privateKey: 'priv' },
    },
    {
      id: 'id2',
      email: 'email2',
      password: 'password2',
      rsaKeyPair: { publicKey: 'pub2', privateKey: 'priv2' },
    },
  ];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UserManagementService,
          useValue: {
            createUser: jest.fn(),
            getUser: jest.fn(),
            getAllUsers: jest.fn(),
          },
        },
        UsersController,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(UsersController);
    userService = module.get(UserManagementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'piotr@gmail.com',
      password: 'IAmPassword',
    };

    it('should call createUser method', async () => {
      await controller.register(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the created user id', async () => {
      const newUserId = 'user-id';

      jest.spyOn(userService, 'createUser').mockResolvedValueOnce(newUserId);

      const result = await controller.register(createUserDto);

      expect(result).toEqual({ id: newUserId });
    });
  });

  describe('getUser', () => {
    it('should call getUser method', async () => {
      const userId = 'id';

      await controller.getUser(userId);

      expect(userService.getUser).toHaveBeenCalledWith(userId);
    });

    it('should return userDto', async () => {
      jest.spyOn(userService, 'getUser').mockResolvedValueOnce(usersDtos[0]);

      const result = await controller.getUser('id');

      expect(result).toEqual(usersDtos[0]);
    });
  });

  describe('getUser', () => {
    it('should call getAllUsers method', async () => {
      await controller.getUsers();

      expect(userService.getAllUsers).toHaveBeenCalledWith();
    });

    it('should return usersDto array', async () => {
      jest.spyOn(userService, 'getAllUsers').mockResolvedValueOnce(usersDtos);

      const result = await controller.getUsers();

      expect(result).toEqual(usersDtos);
    });
  });
});
