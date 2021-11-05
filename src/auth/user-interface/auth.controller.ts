import { Controller, Post, Req, UseGuards, Body } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiProperty,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards';
import { LoggedInUserDto } from '../../auth';
import { AuthToken } from '../auth.service';

export class Credentials {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBasicAuth('Email and password auth')
  @ApiResponse({
    status: 200,
    type: AuthToken,
    description: 'Api bearer token',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(
    @Req() req: LoggedInUserDto,
    @Body() credentials: Credentials,
  ): Promise<AuthToken> {
    return this.authService.login(req.user);
  }
}
