import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Public } from '../auth/public.decorator';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) { }

  @Public()
  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }
  @Public()
  @Get("slug/:slug")
  getOne(@Param('slug') slug: string) {
    return this.collectionsService.findOne(slug);
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.collectionsService.remove(Number(id));
  }
}