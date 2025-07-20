import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './cart.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.entity';

@Module({
  providers: [CartService, UsersService, ProductsService, CategoriesService],
  controllers: [CartController],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, User, Product, Category])],
  exports: [CartService]
})
export class CartModule {}
