import { Controller, Get, Post as HttpPost, Body, Param, Patch, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  async create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.postsService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.postsService.remove(+id);
    return { message: 'Post deleted' };
  }
}
