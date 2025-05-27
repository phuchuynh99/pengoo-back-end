import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dataSourceOptions from './db/data-source';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => (dataSourceOptions),
    }),
    TypeOrmModule.forFeature([User, Product, Category]),
    UsersModule,
    AuthModule,
    ProductsModule
  ],
})
export class AppModule {}
