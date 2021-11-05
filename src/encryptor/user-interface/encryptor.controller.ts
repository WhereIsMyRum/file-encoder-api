import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

import { DataToEncrypt, DecryptedData, EncryptedData } from '../dtos';
import { EncryptorService } from '../encryptor.service';
import { JwtAuthGuard, LoggedInUserDto } from '../../auth';
import { RSAKeyPair } from '../../users/domain';

@ApiTags('Encryptor')
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
  @Post('/generate-key-pair')
  generateKeyPair(@Req() req: LoggedInUserDto): Promise<RSAKeyPair> {
    return this.encryptorService.generateRsaKeyPair(req.user);
  }

  @ApiResponse({
    status: 200,
    type: EncryptedData,
    description: 'Encrypted data',
  })
  @Post('/encrypt')
  encryptFile(
    @Req() req: LoggedInUserDto,
    @Body() dataToEncrypt?: DataToEncrypt,
  ): Promise<EncryptedData> {
    return this.encryptorService.encryptFile(req.user, dataToEncrypt);
  }

  @ApiResponse({
    status: 200,
    type: DecryptedData,
    description: 'Encrypted data',
  })
  @Post('/decrypt')
  decryptFile(
    @Req() req: LoggedInUserDto,
    @Body() file: EncryptedData,
  ): Promise<DecryptedData> {
    return this.encryptorService.decryptFile(req.user, file);
  }
}
