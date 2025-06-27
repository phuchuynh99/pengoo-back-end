import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from '../products/update-product.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator'; // adjust path if needed

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
    examples: {
      default: {
        summary: 'Example product',
        value: {
          product_name: "Sample Product",
          description: "A great product for testing.",
          features: [
            { title: "Feature 1", content: "First feature description" },
            { title: "Feature 2", content: "Second feature description" }
          ],
          product_price: 99.99,
          discount: 10,
          slug: "sample-product",
          meta_title: "Sample Product Meta Title",
          meta_description: "Meta description for SEO.",
          quantity_sold: 0,
          quantity_stock: 100,
          categoryId: 1,
          publisherID: 1,
          status: "active",
          tags: ["electronics", "gadget"]
        }
      }
    }
  })
  @Post()
  @Public()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Map files by fieldname
    const mainImage = files.find(f => f.fieldname === 'mainImage');
    const detailImages = files.filter(f => f.fieldname === 'detailImages');
    const featureImages = files.filter(f => f.fieldname === 'featureImages');

    // Parse features if sent as string
    const features = typeof createProductDto.featured === 'string'
      ? JSON.parse(createProductDto.featured)
      : createProductDto.featured;
    console.log(featureImages)
    if (!mainImage) {
      throw new Error('Main image is required');
    }
    return this.productsService.create(
      createProductDto,
      mainImage,
      detailImages,
      features,
      featureImages,
    );
  }

  @Get()
  @Public()
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
  @Public()
  findById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @Public()
  @UseInterceptors(AnyFilesInterceptor())

  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Map files by fieldname
    const mainImage: Express.Multer.File | undefined = files?.find(f => f.fieldname === 'mainImage');
    const detailImages = files?.filter(f => f.fieldname === 'detailImages') || [];
    const featureImages = files?.filter(f => f.fieldname === 'featureImages') || [];

    // Parse features if sent as string
    const features = typeof updateProductDto.featured === 'string'
      ? JSON.parse(updateProductDto.featured)
      : updateProductDto.featured;
    const deleteImages = typeof updateProductDto.deleteImages === 'string'
      ? JSON.parse(updateProductDto.deleteImages)
      : updateProductDto.deleteImages;
    console.log(featureImages)
    return this.productsService.update(
      id,
      updateProductDto,
      mainImage,
      detailImages,
      features,
      featureImages,
      deleteImages
    );
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}