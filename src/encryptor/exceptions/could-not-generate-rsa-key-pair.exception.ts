import { IntentionalInternalServerErrorException } from '@file-encoder-api/common';

export class CouldNotGenerateRsaKeyPairException extends IntentionalInternalServerErrorException {
  constructor() {
    super('An error occured while generating RSA key pair. Please try again.');
  }
}
