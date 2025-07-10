import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Product } from 'src/products/product.entity';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import slugify from 'slugify';

@Injectable()
export class CollectionService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) { }

  async create(data: CreateCollectionDto, file): Promise<Collection> {
    const collection = this.collectionRepo.create({
      name: data.name,
      slug: slugify(data.name, { lower: true }),
      description: data.description
    });
    console.log(data)
    if (file) {
      const uploadMain = await this.cloudinaryService.uploadImage(file);
      collection.image_url = uploadMain.secure_url;
    }
    const savedCollection = await this.collectionRepo.save(collection);

    if (data.productIds && data.productIds.length > 0) {
      await this.updateProductsInCollection(savedCollection.id, { productIds: data.productIds });
    }

    return savedCollection
  }
  async updateProductsInCollection(
    collectionId: number,
    data: { productIds: number[] }
  ): Promise<Collection> {
    const collection = await this.collectionRepo.findOne({
      where: { id: collectionId },
      relations: ['products']
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    await this.productRepo
      .createQueryBuilder()
      .update()
      .set({ collection: null })
      .where('collectionId = :id', { id: collectionId })
      .execute();

    if (data.productIds && data.productIds.length > 0) {
      await this.productRepo
        .createQueryBuilder()
        .update()
        .set({ collection: collection })
        .whereInIds(data.productIds)
        .execute();
    }

    const updated = await this.collectionRepo.findOne({
      where: { id: collectionId },
      relations: ['products']
    });

    if (!updated) {
      throw new NotFoundException('Collection not found after update');
    }

    return updated;
  }

  findAll(): Promise<Collection[]> {
    return this.collectionRepo.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Collection> {
    const collection = await this.collectionRepo.findOne({
      where: { id },
      relations: ['products']
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async update(id: number, data: UpdateCollectionDto, file?: Express.Multer.File): Promise<Collection> {
    const collection = await this.collectionRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (data.name) {
      collection.name = data.name;
      collection.slug = slugify(data.name, { lower: true })
    }

    if (data.description) collection.description = data.description;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      collection.image_url = upload.secure_url;
    }

    const updatedCollection = await this.collectionRepo.save(collection);

    if (data.productIds) {
      await this.updateProductsInCollection(updatedCollection.id, { productIds: data.productIds });
    }

    return updatedCollection
  }

  async remove(id: number): Promise<void> {
    const collection = await this.collectionRepo.findOne({ where: { id } });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    // Xoá quan hệ với products trước (nếu cần)
    await this.productRepo
      .createQueryBuilder()
      .update()
      .set({ collection: null })
      .where('collectionId = :id', { id })
      .execute();

    await this.collectionRepo.remove(collection);
  }
}
