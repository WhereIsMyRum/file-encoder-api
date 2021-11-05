import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(query: string) {
    super(`User with ${query} was not found.`);
  }
}
