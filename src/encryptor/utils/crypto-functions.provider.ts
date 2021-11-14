import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as crypto from 'crypto';

@Injectable()
export class CryptoFunctionsProvider {
  generateKeyPair = promisify(crypto.generateKeyPair);
  randomBytes = promisify(crypto.randomBytes);
  createCipheriv = crypto.createCipheriv;
  createDecipheriv = crypto.createDecipheriv;
  publicEncrypt = crypto.publicEncrypt;
  privateDecrypt = crypto.privateDecrypt;
  constants = crypto.constants;
}
