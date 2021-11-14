import { Test } from '@nestjs/testing';

import { RSAKeyPair, User } from '@file-encoder-api/users/domain';
import { JwtAuthGuard, LoggedInUserDto } from '@file-encoder-api/auth';

import { EncryptorController } from './encryptor.controller';
import { EncryptorService } from '../domain';
import { EncryptedData } from '../dtos';

describe('EncryptorController', () => {
  let controller: EncryptorController;
  let encryptorService: EncryptorService;

  const user = {} as User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: EncryptorService,
          useValue: {
            generateRsaKeyPair: jest.fn(),
            encryptFile: jest.fn(),
          },
        },
        EncryptorController,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EncryptorController);
    encryptorService = module.get(EncryptorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateKeyPair', () => {
    const rsaKeyPair: RSAKeyPair = {
      privKey: 'private-key',
      pubKey: 'public-key',
    };

    it('should generate rsaKeyPair using EncryptorService and return it', async () => {
      jest
        .spyOn(encryptorService, 'generateRsaKeyPair')
        .mockResolvedValueOnce(rsaKeyPair);

      const result = await controller.generateKeyPair({
        user: user,
      } as LoggedInUserDto);

      expect(encryptorService.generateRsaKeyPair).toHaveBeenCalledWith(user);
      expect(result).toEqual(rsaKeyPair);
    });

    it('should rethrow the error thrown by EncryptorService', async () => {
      const error = new Error('error');

      jest
        .spyOn(encryptorService, 'generateRsaKeyPair')
        .mockRejectedValueOnce(error);

      await expect(
        async () =>
          await controller.generateKeyPair({
            user: user,
          } as LoggedInUserDto),
      ).rejects.toThrow(error);
    });
  });

  describe('encryptFile', () => {
    const encryptedData: EncryptedData = {
      data: 'data',
      iv: 'iv',
      aesKey: 'aes-key',
    };

    it('should encrypt the file using EncryptorService and return the EncryptedData', async () => {
      jest
        .spyOn(encryptorService, 'encryptFile')
        .mockResolvedValueOnce(encryptedData);

      const result = await controller.encryptFile({
        user: user,
      } as LoggedInUserDto);

      expect(encryptorService.encryptFile).toHaveBeenCalledWith(user);
      expect(result).toEqual(encryptedData);
    });

    it('should rethrow the error thrown by EncryptorService', async () => {
      const error = new Error('error');

      jest.spyOn(encryptorService, 'encryptFile').mockRejectedValueOnce(error);

      await expect(
        async () =>
          await controller.encryptFile({
            user: user,
          } as LoggedInUserDto),
      ).rejects.toThrow(error);
    });
  });
});
