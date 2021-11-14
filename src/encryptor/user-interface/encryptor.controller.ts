import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Header,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

import { ExceptionsInterceptor } from '@file-encoder-api/common';
import { RSAKeyPair } from '@file-encoder-api/users/domain';

import { EncryptedData } from '../dtos';
import { EncryptorService } from '../domain';
import { JwtAuthGuard, LoggedInUserDto } from '../../auth';

@ApiTags('Encryptor')
@UseInterceptors(ExceptionsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'Bearer token',
  description: 'Bearer token',
})
@ApiBearerAuth('Bearer token')
@Controller()
export class EncryptorController {
  constructor(private readonly encryptorService: EncryptorService) {}

  @ApiResponse({
    status: 200,
    type: RSAKeyPair,
    description: 'RSA Key pair',
  })
  @HttpCode(200)
  @Post('/generate-key-pair')
  generateKeyPair(@Req() req: LoggedInUserDto): Promise<RSAKeyPair> {
    return this.encryptorService.generateRsaKeyPair(req.user);
  }

  @ApiResponse({
    status: 200,
    type: EncryptedData,
    description: 'Encrypted data',
  })
  @HttpCode(200)
  @Post('/encrypt')
  encryptFile(@Req() req: LoggedInUserDto): Promise<EncryptedData> {
    return this.encryptorService.encryptFile(req.user);
  }

  @ApiExcludeEndpoint()
  @Post('/decrypt')
  @Header('content-type', 'application/pdf')
  @HttpCode(200)
  decryptFile(
    @Req() req: LoggedInUserDto,
    @Body() file: EncryptedData,
  ): Promise<string> {
    return this.encryptorService.decryptFile(req.user, file);
  }
}
