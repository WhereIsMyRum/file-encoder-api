import * as bcrypt from 'bcrypt';

import { CredentialsModel } from '@file-encoder-api/users/infrastructure';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  const password = 'my-password';

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkPassword', () => {
    it('should return true if password is correct', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await service.checkPassword(
        {
          password: { salt, hashedPassword },
        } as unknown as CredentialsModel,
        password,
      );

      expect(result).toEqual(true);
    });

    it('should return false if password is incorrect', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await service.checkPassword(
        {
          password: { salt, hashedPassword },
        } as unknown as CredentialsModel,
        'incorrect-password',
      );

      expect(result).toEqual(false);
    });
  });
});
