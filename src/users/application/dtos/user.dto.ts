import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  _id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
