import { Test } from '@nestjs/testing';

import {
  CredentialsRepository,
  UserRepository,
} from '@file-encoder-api/users/infrastructure';

import { UserManagementService } from './user-management.service';
import { CreateUserDto } from '../dtos';
import {
  CredentialsFactory,
  UserFactory,
  User,
  UserCredentials,
} from '../../domain';
import {
  CouldNotRegisterUserException,
  UserNotFoundException,
} from '../exceptions';

describe('UserManagementService', () => {
  let userManagementService: UserManagementService;
  let userRepository: UserRepository;
  let credentialsRepository: CredentialsRepository;
  let userFactory: UserFactory;
  let credentialsFactory: CredentialsFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            getById: jest.fn(),
            insert: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CredentialsRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: UserFactory,
          useValue: {
            createUser: jest.fn(),
          },
        },
        {
          provide: CredentialsFactory,
          useValue: {
            createCredentials: jest.fn(),
          },
        },
        UserManagementService,
      ],
    }).compile();

    userManagementService = module.get(UserManagementService);
    userRepository = module.get(UserRepository);
    credentialsRepository = module.get(CredentialsRepository);
    userFactory = module.get(UserFactory);
    credentialsFactory = module.get(CredentialsFactory);
  });

  afterEach(() => jest.clearAllMocks());

  const createUserDto: CreateUserDto = {
    email: 'user@email.com',
    password: 'userPassword',
  };
  const expectedUser = new User('id', 'email');

  it('should be defined', () => {
    expect(userManagementService).toBeDefined();
  });

  describe('createUser', () => {
    describe('if no database error occur', () => {
      const expectedCredentials: UserCredentials = {
        id: 'id',
        email: 'user@email.com',
        password: {
          salt: 'salt',
          hashedPassword: 'hashaedPassword',
        },
      };

      beforeEach(() => {
        jest.spyOn(userFactory, 'createUser').mockReturnValue(expectedUser);
      });

      it('should insert a new User through the UserRepository', async () => {
        await userManagementService.createUser(createUserDto);

        expect(userRepository.insert).toHaveBeenCalledWith(expectedUser);
      });

      it('should insert new User Credentials through the CredentialsRepository', async () => {
        jest
          .spyOn(credentialsFactory, 'createCredentials')
          .mockResolvedValueOnce(expectedCredentials);

        await userManagementService.createUser(createUserDto);

        expect(credentialsRepository.insert).toHaveBeenCalledWith(
          expectedCredentials,
        );
      });
    });

    describe('if a database error occurs while inserting the User', () => {
      beforeEach(() => {
        jest.spyOn(userRepository, 'insert').mockRejectedValueOnce({});
      });

      it('should throw CouldNotRegisterUserException', async () => {
        await expect(async () => {
          await userManagementService.createUser(createUserDto);
        }).rejects.toThrow(CouldNotRegisterUserException);
      });

      it('should not insert new user Credentials', async () => {
        await expect(async () => {
          await userManagementService.createUser(createUserDto);
        }).rejects.toThrow(CouldNotRegisterUserException);

        expect(credentialsRepository.insert).not.toHaveBeenCalled();
      });
    });

    describe('if a database error occurs while inserting the Credentials', () => {
      beforeEach(() => {
        jest.spyOn(credentialsRepository, 'insert').mockRejectedValueOnce({});
        jest.spyOn(userFactory, 'createUser').mockReturnValueOnce(expectedUser);
      });

      it('should throw CouldNotRegisterUserException', async () => {
        await expect(async () => {
          await userManagementService.createUser(createUserDto);
        }).rejects.toThrow(CouldNotRegisterUserException);
      });

      it('should delete the inserted user from the database', async () => {
        await expect(async () => {
          await userManagementService.createUser(createUserDto);
        }).rejects.toThrow(CouldNotRegisterUserException);

        expect(userRepository.delete).toHaveBeenCalledWith(
          expectedUser.getId(),
        );
      });

      describe('if an error is thrown during incorrect User deletion', () => {
        it('should throw CouldNotRegisterUserException', async () => {
          jest.spyOn(credentialsRepository, 'insert').mockRejectedValueOnce({});
          jest.spyOn(userRepository, 'delete').mockRejectedValue({});

          await expect(async () => {
            await userManagementService.createUser(createUserDto);
          }).rejects.toThrow(CouldNotRegisterUserException);

          expect(credentialsRepository.insert).toHaveBeenCalled();
          expect(userRepository.delete).toHaveBeenCalled();
        });
      });
    });
  });

  describe('getUser', () => {
    it('should return a user if it was found in the repository', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(expectedUser);

      const returnedUser = await userManagementService.getUser('id');

      expect(returnedUser).toEqual(expectedUser);
    });

    it('should throw UserNotFoundException if no user with specified id is found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValueOnce(null);

      await expect(async () => {
        await userManagementService.getUser('id');
      }).rejects.toThrow(UserNotFoundException);
    });
  });
});
