import * as bcrypt from 'bcrypt';

import { CredentialsModel } from 'src/users/infrastructure';

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

    console.log(credentials, inputPassword, hashedInputPassword);
    return credentials.password.hashedPassword === hashedInputPassword;
  }
}
