import { PartialType } from '@nestjs/mapped-types';
import { CreateCmsContentDto } from './create-cms-content.dto';

export class UpdateCmsContentDto extends PartialType(CreateCmsContentDto) {}