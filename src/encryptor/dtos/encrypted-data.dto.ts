import { ApiProperty } from '@nestjs/swagger';

export class EncryptedData {
  @ApiProperty()
  data!: string;

  @ApiProperty()
  iv!: string;

  @ApiProperty()
  aesKey!: string;
}
