import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';
import { Public } from 'src/auth/public.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) { }

  @Public()
  @Post()
  create(@Body() body: CreateCollectionDto) {
    return this.collectionService.create(body);
  }

  @Public()
  @Post('update-product-in-collection/:id')
  updateProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { productIds: number[] }
  ) {
    return this.collectionService.updateProductsInCollection(id, body);
  }

  @Public()
  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Collection>) {
    return this.collectionService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.remove(id);
  }
}
