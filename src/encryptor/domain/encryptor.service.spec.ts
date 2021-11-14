import { Test } from '@nestjs/testing';

import { FileFetcherService } from '@file-encoder-api/common';
import { UserRepository } from '@file-encoder-api/users/infrastructure';
import { User } from '@file-encoder-api/users/domain';

import { EncryptorService } from './encryptor.service';
import { CryptoFunctionsProvider } from '../utils';
import { cryptoFunctionsProviderMock } from '../utils/crypto-functions.provider.mock.spec';
import { Cipher, KeyObject } from 'crypto';
import {
  CouldNotGenerateRsaKeyPairException,
  RSAKeyPairNotFoundException,
} from '../exceptions';
import {
  ErrorEncryptingFileException,
  FailedToFetchFileException,
} from './exceptions';

describe('EncryptorSerivce', () => {
  let service: EncryptorService;
  let userRepository: UserRepository;
  let fileFetcher: FileFetcherService;
  let crypto: CryptoFunctionsProvider;

  const user = new User('id', 'user@email.com');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: FileFetcherService,
          useValue: {
            fetchFile: jest.fn(),
          },
        },
        cryptoFunctionsProviderMock,
        EncryptorService,
      ],
    }).compile();

    service = module.get(EncryptorService);
    userRepository = module.get(UserRepository);
    fileFetcher = module.get(FileFetcherService);
    crypto = module.get(CryptoFunctionsProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRsaKeyPair', () => {
    const newRsaKeyPair = {
      publicKey: 'pub-key',
      privateKey: 'priv-key',
    } as unknown as { publicKey: KeyObject; privateKey: KeyObject };
    const mappedNewRsaKeyPair = {
      privKey: newRsaKeyPair.privateKey,
      pubKey: newRsaKeyPair.publicKey,
    };

    jest.spyOn(user, 'updateRsaKeyPair');

    describe('if no errors are thrown', () => {
      it("should update User's with new RSA key pair using crypto, save it and return the new key pair", async () => {
        jest
          .spyOn(crypto, 'generateKeyPair')
          .mockResolvedValueOnce(newRsaKeyPair);

        const result = await service.generateRsaKeyPair(user);

        expect(user.updateRsaKeyPair).toHaveBeenCalledWith(mappedNewRsaKeyPair);
        expect(userRepository.save).toHaveBeenCalledWith(user);
        expect(result).toEqual(mappedNewRsaKeyPair);
      });
    });

    describe("if crypto's generateKeyPair throws an error", () => {
      it('should not update the rsa KeyPair and throw CouldNotGenerateRsaKeyPairException', async () => {
        jest.spyOn(crypto, 'generateKeyPair').mockRejectedValueOnce({});

        await expect(
          async () => await service.generateRsaKeyPair(user),
        ).rejects.toThrow(CouldNotGenerateRsaKeyPairException);

        expect(user.updateRsaKeyPair).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
      });
    });

    describe("if UserRepository's save hrows an error", () => {
      it('should throw CouldNotGenerateRsaKeyPairException', async () => {
        jest
          .spyOn(crypto, 'generateKeyPair')
          .mockResolvedValueOnce(newRsaKeyPair);
        jest.spyOn(userRepository, 'save').mockRejectedValueOnce({});

        await expect(
          async () => await service.generateRsaKeyPair(user),
        ).rejects.toThrow(CouldNotGenerateRsaKeyPairException);

        expect(user.updateRsaKeyPair).toHaveBeenCalledWith(mappedNewRsaKeyPair);
        expect(userRepository.save).toHaveBeenCalledWith(user);
      });
    });
  });

  describe('encryptFile', () => {
    const keyPair = { pubKey: 'pub-key', privKey: 'priv-key' };
    const file = 'file-string';
    const iv = Buffer.from('iv');
    const aesKey = Buffer.from('aes-key');
    const encryptedValue = 'encrypted';
    const encryptedKey = Buffer.from('encrypted-aes-key');
    const cipher = {
      update: jest.fn().mockReturnValue(encryptedValue),
      final: jest.fn().mockReturnValue(''),
    } as unknown as Cipher;
    const userWithoutRSAKeyPair = new User('id', 'user@email.com');

    user.updateRsaKeyPair(keyPair);

    describe('if user has not RSA key pair generated', () => {
      it('should throw RSAKeyPairNotFounException', async () => {
        await expect(
          async () => await service.encryptFile(userWithoutRSAKeyPair),
        ).rejects.toThrow(RSAKeyPairNotFoundException);
      });
    });

    describe('if no errors are thrown', () => {
      it('should fetch file to encrypt, ecrypt it using crypto and return EncryptedData', async () => {
        jest.spyOn(fileFetcher, 'fetchFile').mockResolvedValueOnce(file);
        jest
          .spyOn(crypto, 'randomBytes')
          .mockResolvedValueOnce(Buffer.from(aesKey));
        jest.spyOn(crypto, 'randomBytes').mockResolvedValueOnce(iv);
        jest.spyOn(crypto, 'createCipheriv').mockReturnValueOnce(cipher);
        jest.spyOn(crypto, 'publicEncrypt').mockReturnValueOnce(encryptedKey);

        const result = await service.encryptFile(user);

        expect(fileFetcher.fetchFile).toHaveBeenCalled();
        expect(result).toEqual({
          data: encryptedValue,
          iv: iv.toString('base64'),
          aesKey: encryptedKey.toString('base64'),
        });
      });
    });

    describe('if error is thrown during file fetching', () => {
      it('should throw FailedToFetchFileException', async () => {
        jest.spyOn(fileFetcher, 'fetchFile').mockRejectedValueOnce({});

        await expect(
          async () => await service.encryptFile(user),
        ).rejects.toThrow(FailedToFetchFileException);
      });
    });

    describe('if an error is thrown at any other place', () => {
      it('should throw ErrorEncryptingFileException', async () => {
        jest.spyOn(fileFetcher, 'fetchFile').mockResolvedValueOnce(file);
        jest.spyOn(crypto, 'randomBytes').mockRejectedValueOnce({});

        await expect(
          async () => await service.encryptFile(user),
        ).rejects.toThrow(ErrorEncryptingFileException);
      });
    });
  });
});
