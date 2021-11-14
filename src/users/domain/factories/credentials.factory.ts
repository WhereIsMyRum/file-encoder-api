import { PasswordService } from '@file-encoder-api/common';
import { Injectable } from '@nestjs/common';

import { User, UserCredentials } from '../user';

@Injectable()
export class CredentialsFactory {
  constructor(private readonly passwordService: PasswordService) {}

  async createCredentials(
    user: User,
    password: string,
  ): Promise<UserCredentials> {
    const salt = await this.passwordService.generateSalt();

    return {
      id: user.getId(),
      email: user.getEmail(),
      password: {
        salt,
        hashedPassword: await this.passwordService.hashPassword(password, salt),
      },
    };
  }
}
