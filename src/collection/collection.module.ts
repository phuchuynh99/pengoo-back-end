import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Product } from 'src/products/product.entity';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Product]), CloudinaryModule],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule { }
