import { Test } from '@nestjs/testing';

import { UserFactory } from './user.factory';
import { User } from '../user';

describe('UserFactory', () => {
  let userFactory: UserFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserFactory],
    }).compile();

    userFactory = module.get(UserFactory);
  });

  it('should be defined', () => {
    expect(userFactory).toBeDefined();
  });

  describe('createUser', () => {
    it('should return a User instance with correctly assignes params', () => {
      const email = 'user@email.com';
      const rsaKeyPair = {
        privKey: 'private-key',
        pubKey: 'public-key',
      };

      const user = userFactory.createUser({ email, rsaKeyPair });

      expect(user).toBeInstanceOf(User);
      expect(user.getId()).toBeDefined();
      expect(user.getEmail()).toEqual(email);
      expect(user.getRsaKeyPair()).toEqual(rsaKeyPair);
    });
  });
});
