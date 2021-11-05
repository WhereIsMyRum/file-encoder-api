import { ApiProperty } from '@nestjs/swagger';

export class EncryptedData {
  @ApiProperty()
  ciphertextBlocks!: string[];
}
