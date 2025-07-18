import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Category } from 'src/categories/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Featured } from 'src/products/entities/featured.entity'; 
import { PublishersModule } from 'src/publishers/publishers.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';
import { Order } from 'src/orders/order.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      User,
      Product,
      Order,
      Category,
      Tag,
      Featured,
    ]),
    PublishersModule,
    CloudinaryModule,
    TagsModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
