import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from '../products/update-product.dto';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { UpdateCategoryDto } from '../categories/update-category.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createProductDto: CreateProductDto, file): Promise<Product> {
    const category = await this.categoriesService.findById(createProductDto.categoryId);
    const newProduct = new Product();
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    newProduct.product_name = createProductDto.product_name;
    newProduct.description = createProductDto.description;
    newProduct.product_price = createProductDto.product_price;
    newProduct.slug = createProductDto.slug;
    newProduct.quantity_sold = createProductDto.quantity_sold;
    newProduct.category = category;
    newProduct.image_url = uploadResult.secure_url;
    newProduct.discount = createProductDto.discount;
    newProduct.meta_description = createProductDto.meta_description;
    newProduct.meta_title = createProductDto.meta_title;
    newProduct.status = createProductDto.status;
    newProduct.created_at = new Date();
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id: id }, relations: ['category'] });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    let product = await this.findById(id);
    const { categoryId, ...rest } = updateProductDto;
    const category = categoryId ? await this.categoriesService.findById(categoryId) : null;
    if (category) {
      product.category = category;
    }
    //Option 1
    // Object.assign(product, rest);
    //Option 2
    product.product_name = updateProductDto.product_name;
    product.description = updateProductDto.description;
    product.product_price = updateProductDto.product_price;
    product.slug = updateProductDto.slug;
    product.quantity_sold = updateProductDto.quantity_sold;
    product.discount = updateProductDto.discount;
    product.meta_description = updateProductDto.meta_description;
    product.meta_title = updateProductDto.meta_title;
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findById(id);
    await this.productsRepository.remove(product);
  }
}
