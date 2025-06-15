import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Category } from 'src/categories/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { PublishersModule } from 'src/publishers/publishers.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { TagsModule } from 'src/tags/tags.module';
import { Tag } from '../tags/entities/tag.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProductsModule } from 'src/products/products.module';
import { Feature } from 'src/products/entities/feature.entity';

@Module({
  providers: [OrdersService, UsersService, ProductsService, CategoriesService],
  controllers: [OrdersController],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Product, Category, Tag, Feature]),
    PublishersModule,
    CloudinaryModule,
    TagsModule,
    NotificationsModule,
    ProductsModule
  ],
  exports: [OrdersService]
})
export class OrdersModule { }
