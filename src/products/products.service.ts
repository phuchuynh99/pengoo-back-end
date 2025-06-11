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
import { Tag } from 'src/tags/entities/tag.entity';
import { PublishersService } from 'src/publishers/publishers.service';
import { TagsService } from 'src/tags/tags.service';
import { Image } from './entities/image.entity';
import { Feature } from './entities/feature.entity';
export class FilterProductDto {
  name?: string;
  categoryId?: number;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
}
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Feature)
    private featuresRepository: Repository<Feature>,
    private readonly publishersService: PublishersService,
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
    private tagsService: TagsService,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) { }

  async create(
    createProductDto: CreateProductDto,
    mainImage, detailImages, features, featureImages
  ): Promise<Product> {
    const category_ID = await this.categoriesService.findById(createProductDto.categoryId);
    const publisher_ID = await this.publishersService.findOne(createProductDto.publisherID);
    const newProduct = new Product();

    const uploadResult = await this.cloudinaryService.uploadImage(mainImage);
    const imageEntities = await Promise.all(
      detailImages.map(async (file) => {
        const result = await this.cloudinaryService.uploadImage(file);
        const image = new Image();
        image.url = result.secure_url;
        return image;
      })
    );
    let tags: any = ['new'];
    // if (createProductDto.tags && createProductDto.tags.length > 0) {
    //   tags = await Promise.all(
    //     createProductDto.tags.map(async (tagName) => {
    //       let tag = await this.tagsService.findOneByName(tagName);
    //       if (!tag) {
    //         tag = this.tagRepo.create({ name: tagName });
    //         await this.tagRepo.save(tag);
    //       }
    //       return tag;
    //     })
    //   );
    // }
    newProduct.product_name = createProductDto.product_name;
    newProduct.description = createProductDto.description;
    newProduct.product_price = createProductDto.product_price;
    newProduct.slug = createProductDto.slug;
    newProduct.quantity_sold = createProductDto.quantity_sold;
    newProduct.category_ID = category_ID;
    newProduct.publisher_ID = publisher_ID;
    newProduct.image_url = uploadResult.secure_url;
    newProduct.discount = createProductDto.discount;
    newProduct.meta_description = createProductDto.meta_description;
    newProduct.meta_title = createProductDto.meta_title;
    newProduct.status = createProductDto.status;
    newProduct.tags = tags;
    newProduct.images = imageEntities;
    const savedProduct = this.productsRepository.save(newProduct);
    const featureEntities = await Promise.all(
      features.map(async (f, i) => {
        const uploaded = await this.cloudinaryService.uploadImage(featureImages[i]);
        return this.featuresRepository.create({
          title: f.title,
          content: f.content,
          image: uploaded.secure_url,
          product: newProduct,
        });
      })
    );

    await this.featuresRepository.save(featureEntities);

    return savedProduct;
  }

  async searchAndFilter(filter: FilterProductDto): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category_ID', 'category')
      .leftJoinAndSelect('product.publisher_ID', 'publisher')
      .leftJoinAndSelect('product.tags', 'tags')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.features', 'feature');

    if (filter.name) {
      query.andWhere('product.product_name ILIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId: filter.categoryId });
    }

    if (filter.tags && filter.tags.length > 0) {
      query.andWhere('tags.name IN (:...tags)', { tags: filter.tags });
    }

    if (filter.minPrice) {
      query.andWhere('product.product_price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice) {
      query.andWhere('product.product_price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    return query.getMany();
  }


  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id: id }, relations: ['category'] });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['tags', 'category_ID', 'publisher_ID'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.category_ID) {
      product.category_ID = await this.categoriesService.findById(updateProductDto.category_ID);
    }

    if (updateProductDto.publisher_ID) {
      product.publisher_ID = await this.publishersService.findOne(updateProductDto.publisher_ID);
    }

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      product.image_url = uploadResult.secure_url;
    }

    if (updateProductDto.tags && updateProductDto.tags.length > 0) {
      const tags = await Promise.all(
        updateProductDto.tags.map(async (tagName) => {
          let tag = await this.tagsService.findOneByName(tagName);
          if (!tag) {
            tag = this.tagRepo.create({ name: tagName });
            await this.tagRepo.save(tag);
          }
          return tag;
        })
      );
      product.tags = tags;
    }
    product.product_name = updateProductDto.product_name ?? product.product_name;
    product.description = updateProductDto.description ?? product.description;
    product.product_price = updateProductDto.product_price ?? product.product_price;
    product.slug = updateProductDto.slug ?? product.slug;
    product.quantity_sold = updateProductDto.quantity_sold ?? product.quantity_sold;
    product.discount = updateProductDto.discount ?? product.discount;
    product.meta_description = updateProductDto.meta_description ?? product.meta_description;
    product.meta_title = updateProductDto.meta_title ?? product.meta_title;
    product.status = updateProductDto.status ?? product.status;
    const updatedProduct = await this.productsRepository.save(product);
    const cleanedTags: any = updatedProduct.tags.map(({ id, name }) => ({ id, name }));
    updatedProduct.tags = cleanedTags;
    return updatedProduct;
  }


  async remove(id: number): Promise<void> {
    const product = await this.findById(id);
    await this.productsRepository.remove(product);
  }
}
