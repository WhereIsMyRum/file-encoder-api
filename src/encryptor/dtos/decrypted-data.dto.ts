import { ApiProperty } from '@nestjs/swagger';

export class DecryptedData {
  @ApiProperty()
  contents!: string;
}
