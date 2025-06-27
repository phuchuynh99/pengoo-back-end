import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './posts.entity';
import { PostCatalogue } from './post-catalogue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCatalogue])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
