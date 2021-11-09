import { Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';
import { JwtService } from '@nestjs/jwt';

import { UserRepository, CredentialsRepository } from '../users/infrastructure';
import { User } from '../users/domain';
import { JwtPayload } from './guards';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordService } from 'src/common/services/password.service';

export class AuthToken {
  @ApiProperty({ description: 'Api Bearer token' })
  authToken!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error();
    }

    const credentials = await this.credentialsRepository.getById(user.getId());

    if (!credentials) {
      throw new Error();
    }

    if (await this.passwordService.checkPassword(credentials, password)) {
      return user;
    }

    return null;
  }

  login(user: User): AuthToken {
    const jwtPayload: JwtPayload = { email: user.getEmail() };

    return {
      authToken: this.jwtService.sign(jwtPayload),
    };
  }
}
