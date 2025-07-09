import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UploadedFiles, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';
import { Public } from 'src/auth/public.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) { }

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('image_url'))
  create(
    @Body() body: CreateCollectionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto: CreateCollectionDto = {
      name: body.name,
      description: body.description,
      productIds: JSON.parse(String(body.productIds) || '[]'),
    };
    return this.collectionService.create(dto, file);
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

  @Public()
  @Put(':id')
  @UseInterceptors(FileInterceptor('image_url'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto: UpdateCollectionDto = {
      name: body.name,
      description: body.description,
      productIds: body.productIds ? JSON.parse(body.productIds) : undefined,
    };
    return this.collectionService.update(id, dto, file);
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.remove(id);
  }
}
