import {
  Controller, Get, Post, Body, Patch, Param, Delete
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new image' })
  @ApiBody({
    type: CreateImageDto,
    examples: {
      default: {
        summary: 'Create image',
        value: {
          url: 'https://example.com/image.jpg',
          name: 'Sample Image',
          ord: 1,
          product: { id: 1 }
        }
      }
    }
  })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    type: UpdateImageDto,
    examples: {
      default: {
        summary: 'Update image',
        value: {
          url: 'https://example.com/image2.jpg',
          name: 'Updated Image',
          ord: 2,
          product: { id: 1 }
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
