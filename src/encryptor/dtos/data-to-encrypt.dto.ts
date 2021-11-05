import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DataToEncrypt {
  @ApiProperty({ description: 'Any kind of data to encrypt' })
  @IsString()
  data!: string;
}
