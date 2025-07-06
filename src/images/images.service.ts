import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../products/entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) { }

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepo.create(createImageDto);
    return this.imageRepo.save(image);
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepo.find({ relations: ['product'] });
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepo.findOne({ where: { id }, relations: ['product'] });
    if (!image) throw new NotFoundException(`Image #${id} not found`);
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);
    const updated = this.imageRepo.merge(image, updateImageDto);
    return this.imageRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const image = await this.findOne(id);
    await this.imageRepo.remove(image);
  }

  async moveImage(id: number, folder: string) {
    const image = await this.imageRepo.findOneBy({ id });
    if (!image) throw new NotFoundException('Image not found');
    image.folder = folder;
    return this.imageRepo.save(image);
  }

  async deleteFolder(path: string) {
    // Delete all images in this folder and subfolders
    const images = await this.imageRepo
      .createQueryBuilder('image')
      .where('image.folder LIKE :path', { path: `${path}%` })
      .getMany();

    for (const img of images) {
      await this.imageRepo.delete(img.id);
      // Optionally: delete from Cloudinary as well
    }
    return { deleted: images.length };
  }
}
