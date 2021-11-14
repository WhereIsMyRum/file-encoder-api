import { IntentionalInternalServerErrorException } from '@file-encoder-api/common';

export class ErrorEncryptingFileException extends IntentionalInternalServerErrorException {
  constructor() {
    super('An error occurred while encoding file.');
  }
}
