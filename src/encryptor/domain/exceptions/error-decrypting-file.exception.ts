import { IntentionalInternalServerErrorException } from '@file-encoder-api/common';

export class ErrorDecryptingFileException extends IntentionalInternalServerErrorException {
  constructor() {
    super('An error occurred while decoding file.');
  }
}
