import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserNotFoundException } from '@file-encoder-api/users/application';
import { UserRepository } from '@file-encoder-api/users/infrastructure';
import { User } from '@file-encoder-api/users/domain';

export interface JwtPayload {
  email: string;
}

export interface LoggedInUserDto extends Request {
  user: User;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.getByEmail(payload.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
