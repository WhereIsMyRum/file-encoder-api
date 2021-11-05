import { Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../users/infrastructure';
import { User } from '../users/domain';
import { JwtPayload } from './guards';
import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty({ description: 'Api Bearer token' })
  authToken!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getByEmail(email);

    if (isEqual(user.getPassword(), password)) {
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
