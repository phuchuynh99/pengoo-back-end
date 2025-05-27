import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({where : {id : id}, relations: ['category']});
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.findCategory(createProductDto.categoryId);    
    const newProduct = new Product();
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;
    newProduct.sku = createProductDto.sku;
    newProduct.quantity = createProductDto.quantity;
    newProduct.category = category;
    return this.productsRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    let product = await this.findById(id);
    const { categoryId, ...rest } = updateProductDto;
    const category = categoryId ? await this.findCategory(categoryId) : null;
    if (category) {
      product.category = category;
    }
    //Option 1
    // Object.assign(product, rest);
    //Option 2
    product.name = updateProductDto.name;
    product.description = updateProductDto.description;
    product.price = updateProductDto.price;
    product.sku = updateProductDto.sku;
    product.quantity = updateProductDto.quantity;
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findById(id);
    await this.productsRepository.remove(product);
  }

  async findCategory(categoryId : number): Promise<Category>{
    const category = await this.categoriesRepository.findOne({where : {id : categoryId}});
    if (!category) {
      throw new NotFoundException('Category not found');
    }    
    return category;
  }

  

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['products'] });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({where: {id : id}, relations: ['product'] });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }
}
