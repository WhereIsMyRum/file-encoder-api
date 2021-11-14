import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  UserRepository,
  CredentialsRepository,
} from '@file-encoder-api/users/infrastructure';
import { UserNotFoundException } from '@file-encoder-api/users/application';
import { PasswordService } from '@file-encoder-api/common';
import { User } from '@file-encoder-api/users/domain';

import { JwtPayload } from '../guards';

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
      throw new UserNotFoundException();
    }

    const credentials = await this.credentialsRepository.getById(user.getId());

    if (!credentials) {
      throw new UserNotFoundException();
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
