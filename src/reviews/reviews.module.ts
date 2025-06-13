import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Category } from 'src/categories/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Feature } from 'src/products/entities/feature.entity'; 
import { PublishersModule } from 'src/publishers/publishers.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      User,
      Product,
      Category,
      Tag,
      Feature,
    ]),
    PublishersModule,
    CloudinaryModule,
    TagsModule,
    UsersModule,
    OrdersModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
