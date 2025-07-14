import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsString()
  bgColor?: string;

  @IsOptional()
  @IsString()
  fontFamily?: string;

  @IsOptional()
  @IsString()
  fontSize?: string;
}