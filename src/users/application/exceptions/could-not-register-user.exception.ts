import { IntentionalInternalServerErrorException } from '@file-encoder-api/common';

export class CouldNotRegisterUserException extends IntentionalInternalServerErrorException {
  constructor() {
    super('A user could not be created.');
  }
}
