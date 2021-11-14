import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

import {
  DtoValidationGuard,
  ExceptionsInterceptor,
} from '@file-encoder-api/common';

import { AuthService } from '../domain';
import { LocalAuthGuard } from '../guards';
import { LoggedInUserDto } from '../../auth';
import { AuthToken } from '../domain/auth.service';
import { CredentialsDto } from './dtos/credentials.dto';

@ApiTags('Auth')
@UseInterceptors(ExceptionsInterceptor)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBasicAuth('Email and password auth')
  @ApiResponse({
    status: 200,
    type: AuthToken,
    description: 'Api bearer token',
  })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @UseGuards(new DtoValidationGuard<CredentialsDto>(CredentialsDto))
  @Post('/sign-in')
  async signIn(
    @Req() req: LoggedInUserDto,
    @Body() credentials: CredentialsDto,
  ): Promise<AuthToken> {
    return this.authService.login(req.user);
  }
}
