import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Product } from 'src/products/product.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) { }

  async create(data: CreateCollectionDto): Promise<Collection> {
    const collection = this.collectionRepo.create(data);
    return this.collectionRepo.save(collection);
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

  async update(id: number, data: Partial<Collection>): Promise<Collection> {
    const collection = await this.findOne(id);
    this.collectionRepo.merge(collection, data);
    return this.collectionRepo.save(collection);
  }

  async remove(id: number): Promise<void> {
    const result = await this.collectionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Collection not found');
    }
  }
}
