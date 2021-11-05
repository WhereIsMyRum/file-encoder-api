import { NotFoundException } from '@nestjs/common';

export class RSAKeyPairNotFoundException extends NotFoundException {
  constructor() {
    super('You need to generate a RSA Key pair first!');
  }
}
