import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';

import { RSAKeyPairNotFoundException } from './exceptions';
import { DataToEncrypt, DecryptedData, EncryptedData } from './dtos';
import { User } from '../users/domain';
import { UserRepository } from '../users/infrastructure';

const FILE_PATH = path.resolve(__dirname, '../static/sample.pdf');
const PCKS_1_PADDING_SIZE = 11 * 4;
const PADDING = crypto.constants.RSA_PKCS1_OAEP_PADDING;
const SLICE_SIZE = 512 - PCKS_1_PADDING_SIZE;

@Injectable()
export class EncryptorService {
  constructor(private readonly userRepository: UserRepository) {}

  async generateRsaKeyPair(user: User) {
    const keyPair = crypto.generateKeyPairSync('rsa', {
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

    user.updateRsaKeyPair(keyPair);

    await this.userRepository.save(user);

    return keyPair;
  }

  async encryptFile(
    user: User,
    dataToEncrypt?: DataToEncrypt,
  ): Promise<EncryptedData> {
    const publicKey = user.getRsaKeyPair()?.publicKey;

    if (!publicKey) {
      throw new RSAKeyPairNotFoundException();
    }

    const ciphertextBlocks: string[] = [];
    const data = this.getDataToEncrypt(dataToEncrypt);
    let i = 0;

    do {
      let chunk: Buffer;

      if (i + SLICE_SIZE >= data.length) {
        chunk = data.slice(i);
      } else {
        chunk = data.slice(i, i + SLICE_SIZE);
      }

      ciphertextBlocks.push(this.encryptChunk(chunk, publicKey));

      i += SLICE_SIZE;
    } while (i + SLICE_SIZE < data.length + SLICE_SIZE);

    return { ciphertextBlocks };
  }

  async decryptFile(user: User, data: EncryptedData): Promise<DecryptedData> {
    const privateKey = user.getRsaKeyPair()?.privateKey;
    const decryptedFileChunks: string[] = [];

    if (!privateKey) {
      throw new RSAKeyPairNotFoundException();
    }

    for (const chunk of data.ciphertextBlocks) {
      const chunkBuf = Buffer.from(chunk, 'base64');

      decryptedFileChunks.push(this.decryptChunk(chunkBuf, privateKey));
    }

    return { contents: decryptedFileChunks.join() };
  }

  private getDataToEncrypt(dataToEncrypt?: DataToEncrypt): Buffer {
    let data = readFileSync(FILE_PATH);

    if (dataToEncrypt?.data) {
      data = Buffer.from(dataToEncrypt.data);
    }

    return data;
  }

  private encryptChunk(chunk: Buffer, publicKey: string): string {
    return crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: PADDING,
        },
        chunk,
      )
      .toString('base64');
  }

  private decryptChunk(chunk: Buffer, privateKey: string): string {
    return crypto
      .privateDecrypt(
        {
          key: privateKey.toString(),
          padding: PADDING,
        },
        chunk,
      )
      .toString();
  }
}
