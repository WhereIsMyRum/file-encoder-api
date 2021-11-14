import { IntentionalInternalServerErrorException } from '@file-encoder-api/common';

export class FailedToFetchFileException extends IntentionalInternalServerErrorException {
  constructor() {
    super('An error occurred while fetching file.');
  }
}
