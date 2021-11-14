import { Injectable } from '@nestjs/common';

import { FileFetcherService } from '@file-encoder-api/common';
import { UserRepository } from '@file-encoder-api/users/infrastructure';
import { User } from '@file-encoder-api/users/domain';
import { LoggerService, LoggingLevels } from '@file-encoder-api/common';

import {
  CouldNotGenerateRsaKeyPairException,
  RSAKeyPairNotFoundException,
} from '../exceptions';
import { EncryptedData } from '../dtos';
import {
  FailedToFetchFileException,
  ErrorDecryptingFileException,
  ErrorEncryptingFileException,
} from './exceptions';
import { CryptoFunctionsProvider } from '../utils';

const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-ctr';

@Injectable()
export class EncryptorService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileFetcher: FileFetcherService,
    private readonly crypto: CryptoFunctionsProvider,
  ) {}

  async generateRsaKeyPair(user: User) {
    try {
      const keyPair = await this.crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      const newKeyPair = {
        pubKey: keyPair.publicKey,
        privKey: keyPair.privateKey,
      };

      user.updateRsaKeyPair(newKeyPair);

      await this.userRepository.save(user);

      return newKeyPair;
    } catch (error: any) {
      LoggerService.log(LoggingLevels.error, 'Error generating RSA key pair', {
        trace: error.stack,
        context: {
          userId: user.getId(),
        },
      });

      throw new CouldNotGenerateRsaKeyPairException();
    }
  }

  async encryptFile(user: User): Promise<EncryptedData> {
    const publicKey = user.getRsaKeyPair()?.pubKey;

    if (!publicKey) {
      throw new RSAKeyPairNotFoundException();
    }

    const dataToEncrypt = await this.fetchFile();

    try {
      const [aesKey, iv] = await Promise.all([
        this.crypto.randomBytes(KEY_LENGTH),
        this.crypto.randomBytes(IV_LENGTH),
      ]);

      const cipher = this.crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        aesKey,
        iv,
      );
      let encrypted = cipher.update(dataToEncrypt, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      return {
        data: encrypted,
        iv: iv.toString('base64'),
        aesKey: this.rsaEncryptKey(aesKey, publicKey).toString(),
      };
    } catch (error: any) {
      LoggerService.log(LoggingLevels.error, 'Error encrypting a file', {
        trace: error.stack,
        context: {
          userId: user.getId(),
        },
      });

      throw new ErrorEncryptingFileException();
    }
  }

  async decryptFile(user: User, data: EncryptedData): Promise<string> {
    const privateKey = user.getRsaKeyPair()?.privKey;

    if (!privateKey) {
      throw new RSAKeyPairNotFoundException();
    }

    try {
      const decipher = this.crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        this.rsaDecryptKey(Buffer.from(data.aesKey, 'base64'), privateKey),
        Buffer.from(data.iv, 'base64'),
      );

      let decrypted = decipher.update(data.data, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error: any) {
      LoggerService.log(LoggingLevels.error, 'Error decrypting a file', {
        trace: error.stack,
        context: {
          userId: user.getId(),
        },
      });

      throw new ErrorDecryptingFileException();
    }
  }

  private async fetchFile(
    url = 'http://www.africau.edu/images/default/sample.pdf',
  ): Promise<string> {
    try {
      const file = (await this.fileFetcher.fetchFile(url)) as string;
      return file;
    } catch (error: any) {
      LoggerService.log(LoggingLevels.error, 'Error fetching a file', {
        trace: error.stack,
        context: { url },
      });

      throw new FailedToFetchFileException();
    }
  }

  private rsaEncryptKey(chunk: Buffer, publicKey: string): string {
    return this.crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: this.crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        chunk,
      )
      .toString('base64');
  }

  private rsaDecryptKey(chunk: Buffer, privateKey: string): Buffer {
    return this.crypto.privateDecrypt(
      {
        key: privateKey,
        padding: this.crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      chunk,
    );
  }
}
