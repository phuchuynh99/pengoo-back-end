import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Public } from '../auth/public.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  @Public()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @Public()
  findAll(@Query('type') type?: string) {
    if (type) {
      return this.tagsService.findByType(type);
    }
    return this.tagsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Put(':id')
  @Public()
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(+id, dto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
