import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from '../categories/category.entity';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { TagsService } from 'src/tags/tags.service';
import { PublishersService } from 'src/publishers/publishers.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Featured } from 'src/products/entities/featured.entity';
import { Image } from 'src/products/entities/image.entity';
import { ImagesService } from 'src/images/images.service';
import { Collection } from 'src/collection/entities/collection.entity';

@Module({
  providers: [ProductsService, ImagesService, CategoriesService, TagsService, PublishersService],
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([Product, Category, Tag, Publisher, Featured, Image, Collection]), CloudinaryModule],
  exports: [ProductsService]
})
export class ProductsModule { }
