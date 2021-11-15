import { ApiProperty } from '@nestjs/swagger';

export class EncryptedData {
  @ApiProperty({ description: 'File encrypted using symmetric encryption' })
  data!: string;

  @ApiProperty({
    description: 'Initialization vectore used during file encryption',
  })
  iv!: string;

  @ApiProperty({
    description:
      'AES key used for encryption, encrypted with users public RSA key',
  })
  aesKey!: string;
}
