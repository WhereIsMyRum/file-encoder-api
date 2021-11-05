import { Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/users/infrastructure';
import { User } from 'src/users/domain';
import { JwtPayload } from '../guards';

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

  async login(user: User) {
    const jwtPayload: JwtPayload = { email: user.getEmail() };

    return {
      authToken: this.jwtService.sign(jwtPayload),
    };
  }
}
