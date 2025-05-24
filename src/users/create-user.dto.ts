import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  full_name: string;
  @IsEmail()
  @MinLength(10)
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone_number: string | '';
  @ApiProperty()
  avatar_url: string | '';
  @ApiProperty()
  address: string | '';
  @ApiProperty()
  role: string;
}