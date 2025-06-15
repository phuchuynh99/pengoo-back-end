import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from '../products/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'featureImages[]', maxCount: 10 },
  ]))
  create(
    @Body() createProductDto: any,
    @UploadedFiles() files: {
      file?: Express.Multer.File[],
      images?: Express.Multer.File[],
      ['featureImages[]']?: Express.Multer.File[]
    }
  ) {
    const { features, ...productData } = createProductDto;
    const parsedFeatures = JSON.parse(features); // [{title, content}, ...]
    console.log('amin:', files.file,);
    console.log('features:', features);
    console.log('featureImages:', files?.['featureImages[]']);
    return this.productsService.create(
      productData,
      files?.file?.[0],
      files?.images || [],
      parsedFeatures,
      files?.['featureImages[]'] || []
    );
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('category') categoryId?: number,
    @Query('tags') tags?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.productsService.searchAndFilter({
      name,
      categoryId,
      tags: tags ? tags.split(',') : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
