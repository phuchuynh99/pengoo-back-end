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
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @Post()
  @UseInterceptors(
    FilesInterceptor('featureImages', 10, {
      storage: diskStorage({
        destination: './uploads/features',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() mainImage: Express.Multer.File,
    @UploadedFiles() detailImages: Express.Multer.File[],
    @UploadedFiles() featureImages: Express.Multer.File[],
  ) {
    const { features } = createProductDto;
    const parsedFeatures = typeof features === 'string'
      ? JSON.parse(features)
      : features;
    console.log('features:', parsedFeatures);
    console.log('featureImages:', featureImages);

    return this.productsService.create(
      createProductDto,
      mainImage,
      detailImages,
      parsedFeatures,
      featureImages,
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