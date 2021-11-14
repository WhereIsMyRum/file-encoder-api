import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '@file-encoder-api/common';
import { UserNotFoundException } from '@file-encoder-api/users/application';
import { User } from '@file-encoder-api/users/domain';
import {
  CredentialsModel,
  CredentialsRepository,
  UserRepository,
} from '@file-encoder-api/users/infrastructure';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let credentialsRepository: CredentialsRepository;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let passwordService: PasswordService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useValue: { getByEmail: jest.fn() } },
        { provide: CredentialsRepository, useValue: { getById: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: PasswordService, useValue: { checkPassword: jest.fn() } },
        AuthService,
      ],
    }).compile();

    service = module.get(AuthService);
    credentialsRepository = module.get(CredentialsRepository);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    passwordService = module.get(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    describe('if user is found', () => {
      const user = new User('id', 'email');

      describe('and credentials are found', () => {
        const credentials: CredentialsModel = {
          id: 'id',
          email: 'email',
          password: { salt: 'salt', hashedPassword: 'pass' },
        };

        describe('and password is correct', () => {
          it('should return a user', async () => {
            jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
            jest
              .spyOn(credentialsRepository, 'getById')
              .mockResolvedValue(credentials);
            jest
              .spyOn(passwordService, 'checkPassword')
              .mockResolvedValue(true);

            const result = await service.validateUser('email', 'password');

            expect(result).toEqual(user);
          });
        });

        describe('and password is incorrect', () => {
          it('should return null', async () => {
            jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
            jest
              .spyOn(credentialsRepository, 'getById')
              .mockResolvedValue(credentials);
            jest
              .spyOn(passwordService, 'checkPassword')
              .mockResolvedValue(false);

            const result = await service.validateUser('email', 'password');

            expect(result).toEqual(null);
          });
        });
      });

      describe('and credentials are not found', () => {
        it('should throw UserNotFoundException', async () => {
          jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
          jest.spyOn(credentialsRepository, 'getById').mockResolvedValue(null);

          await expect(
            async () => await service.validateUser('email', 'password'),
          ).rejects.toThrow(UserNotFoundException);
        });
      });
    });

    describe('if user is not found', () => {
      it('should throw UserNotFoundException', async () => {
        jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);

        await expect(
          async () => await service.validateUser('email', 'password'),
        ).rejects.toThrow(UserNotFoundException);
      });
    });
  });

  describe('login', () => {
    const user = new User('id', 'email');

    it('should return the authToken with correct payload', () => {
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementationOnce((payload: any) => payload as string);

      const result = service.login(user);

      expect(result).toEqual({ authToken: { email: user.getEmail() } });
    });
  });
});
