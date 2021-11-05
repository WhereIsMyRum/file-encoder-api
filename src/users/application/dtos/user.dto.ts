import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { RSAKeyPair } from '../../../users/domain';

export class UserDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  rsaKeyPair!: RSAKeyPair;
}
