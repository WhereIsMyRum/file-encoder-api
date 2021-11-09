import { Controller, Post, Req, UseGuards, Body } from '@nestjs/common';
import { ApiBasicAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards';
import { LoggedInUserDto } from '../../auth';
import { AuthToken } from '../auth.service';
import { DtoValidationGuard } from '../../common/guards/dto-validation.guard';
import { CredentialsDto } from './dtos/credentials.dto';

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
  @UseGuards(new DtoValidationGuard<CredentialsDto>(CredentialsDto))
  @Post('/sign-in')
  async signIn(
    @Req() req: LoggedInUserDto,
    @Body() credentials: CredentialsDto,
  ): Promise<AuthToken> {
    return this.authService.login(req.user);
  }
}
