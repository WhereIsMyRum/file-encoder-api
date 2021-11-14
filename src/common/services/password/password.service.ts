import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CredentialsModel } from '../../../users/infrastructure';

@Injectable()
export class PasswordService {
  generateSalt(): Promise<string> {
    const saltRounds = 10;

    return bcrypt.genSalt(saltRounds);
  }

  hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async checkPassword(
    credentials: CredentialsModel,
    inputPassword: string,
  ): Promise<boolean> {
    const hashedInputPassword = await this.hashPassword(
      inputPassword,
      credentials.password.salt,
    );

    return credentials.password.hashedPassword === hashedInputPassword;
  }
}
