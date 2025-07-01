import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCatalogue } from './post-catalogue.entity';
import { CreatePostCatalogueDto } from './dto/create-post-catalogue.dto';
import { UpdatePostCatalogueDto } from './dto/update-post-catalogue.dto';

@Controller('post-catalogues')
export class PostCatalogueController {
  constructor(
    @InjectRepository(PostCatalogue)
    private readonly repo: Repository<PostCatalogue>,
  ) {}

  @Get()
  async findAll() {
    return this.repo.find();
  }

  @Post()
  async create(@Body() dto: CreatePostCatalogueDto) {
    const catalogue = this.repo.create(dto);
    return this.repo.save(catalogue);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePostCatalogueDto) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id: Number(id) } });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const postCount = await this.repo.manager.getRepository('Post').count({ where: { catalogue: { id } } });
    if (postCount > 0) {
      throw new Error('Cannot delete: This catalogue is still used by one or more posts.');
    }
    await this.repo.delete(id);
    return { success: true };
  }
}