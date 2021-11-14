import { InternalServerErrorException } from '@nestjs/common';

export class IntentionalInternalServerErrorException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
