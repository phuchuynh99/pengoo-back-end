import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findProductById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  async findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  async findCategoryById(@Param('id') id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Patch('categories/:id')
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  async removeCategory(@Param('id') id: number) {
    return this.productsService.removeCategory(id);
  }
}
