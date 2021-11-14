import { Test } from '@nestjs/testing';

import { PasswordService } from '@file-encoder-api/common';

import { User } from '../user';
import { CredentialsFactory } from './credentials.factory';

describe('CredentialsFactory', () => {
  let passwordService: PasswordService;
  let credentialsFactory: CredentialsFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PasswordService,
          useValue: {
            generateSalt: jest.fn(),
            hashPassword: jest.fn(),
          },
        },
        CredentialsFactory,
      ],
    }).compile();

    passwordService = module.get(PasswordService);
    credentialsFactory = module.get(CredentialsFactory);
  });

  const userId = 'id';
  const email = 'user@email.com';
  const password = 'password';
  const salt = 'salt';
  const hashedPassword = 'password-hash';
  const user = new User(userId, email);

  it('should be defined', () => {
    expect(credentialsFactory).toBeDefined();
  });

  describe('createCredentials', () => {
    it('should return user credentials with correctly assigned parameters', async () => {
      jest.spyOn(passwordService, 'generateSalt').mockResolvedValueOnce(salt);
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce(hashedPassword);

      const credentials = await credentialsFactory.createCredentials(
        user,
        password,
      );

      expect(credentials).toEqual({
        id: userId,
        email,
        password: {
          salt,
          hashedPassword,
        },
      });
    });
  });
});
