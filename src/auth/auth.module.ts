import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './user-interface/auth.controller';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './guards';
import { CommonModule } from '../common';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY_TIME') },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
