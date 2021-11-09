import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ValidateDto } from 'src/common/dtos/validate-dto';

export class CredentialsDto extends ValidateDto {
  @IsEmail()
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
