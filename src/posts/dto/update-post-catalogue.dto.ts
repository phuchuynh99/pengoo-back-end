import { PartialType } from '@nestjs/mapped-types';
import { CreatePostCatalogueDto } from './create-post-catalogue.dto';

export class UpdatePostCatalogueDto extends PartialType(CreatePostCatalogueDto) {}