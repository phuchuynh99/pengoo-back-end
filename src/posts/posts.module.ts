import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { PostCatalogue } from './post-catalogue.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostCatalogueController } from './post-catalogue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCatalogue])],
  providers: [PostsService],
  controllers: [PostsController, PostCatalogueController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
