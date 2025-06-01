import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  full_name: string;

  @IsEmail()
  @MinLength(10)
  email: string;

  phone_number: string | null | undefined;
  avatar_url: string | null | undefined;
  address: string | null | undefined;
  role: string;
}