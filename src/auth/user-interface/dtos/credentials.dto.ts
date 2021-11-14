import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ValidateDto } from '@file-encoder-api/common';

export class CredentialsDto extends ValidateDto {
  @IsEmail()
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
