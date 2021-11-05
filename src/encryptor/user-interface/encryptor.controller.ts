import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Encryptor')
@Controller()
export class EncryptorController {
  @Post('/encrypt')
  generateKeyPair(): string {
    return 'encrypt';
  }
}
