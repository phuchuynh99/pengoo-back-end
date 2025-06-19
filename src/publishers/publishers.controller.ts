import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Public } from '../auth/public.decorator'; // Add this import

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) { }

  @Post()
  @Public()
  create(@Body() dto: CreatePublisherDto) {
    return this.publishersService.create(dto);
  }

  @Get()
  @Public()
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne(+id);
  }

  @Put(':id')
  @Public()
  update(@Param('id') id: string, @Body() dto: UpdatePublisherDto) {
    return this.publishersService.update(+id, dto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.publishersService.remove(+id);
  }
}
