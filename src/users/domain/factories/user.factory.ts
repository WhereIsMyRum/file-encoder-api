import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UserParameters, User } from '../user';

@Injectable()
export class UserFactory {
  createUser(userParameters: Omit<UserParameters, 'id'>): User {
    return new User(uuid(), userParameters.email, userParameters.rsaKeyPair);
  }
}
