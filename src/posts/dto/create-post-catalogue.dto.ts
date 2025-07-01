import { IsString, IsOptional } from 'class-validator';

export class CreatePostCatalogueDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}