import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import '../cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

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
          folder: 'products',
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
          product: { id: 1 },
          folder: 'folder1/folder2'
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image by ID (also deletes from Cloudinary)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async remove(@Param('id') id: string) {
    // Find image to get its URL for Cloudinary deletion
    const image = await this.imagesService.findOne(+id);
    // Extract public_id from URL
    const match = image.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    const publicId = match ? match[1] : null;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        // Optionally log error
      }
    }
    return this.imagesService.remove(+id);
  }

  @Post('delete-cloudinary')
  @ApiOperation({ summary: 'Delete image from Cloudinary by publicId' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        publicId: { type: 'string', example: 'folder/filename' },
      },
      required: ['publicId'],
    },
  })
  async deleteCloudinary(@Body('publicId') publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @Delete('folder')
  @ApiOperation({ summary: 'Delete all images in a folder (and subfolders) from DB and Cloudinary' })
  async deleteFolder(@Query('path') path: string) {
    return this.imagesService.deleteFolder(path);
  }

  @Get('folders')
  @ApiOperation({ summary: 'Get all folder paths' })
  async getFolderTree() {
    const images = await this.imagesService.findAll();
    // Return unique folder paths for frontend to build tree
    return Array.from(new Set(images.map(img => img.folder || 'default')));
  }
}
