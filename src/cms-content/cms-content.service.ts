import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsContent } from './cms-content.entity';
import { Product } from '../products/product.entity';
import { CreateCmsContentDto } from './dto/create-cms-content.dto';
import { UpdateCmsContentDto } from './dto/update-cms-content.dto';

@Injectable()
export class CmsContentService {
  constructor(
    @InjectRepository(CmsContent)
    private cmsRepo: Repository<CmsContent>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(productId: number, dto: CreateCmsContentDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');
    const cms = this.cmsRepo.create({ ...dto, product });
    return this.cmsRepo.save(cms);
  }

  async update(productId: number, dto: UpdateCmsContentDto) {
    const cms = await this.cmsRepo.findOne({ where: { product: { id: productId } } });
    if (!cms) throw new NotFoundException('CMS Content not found');
    Object.assign(cms, dto);
    return this.cmsRepo.save(cms);
  }

  async findByProduct(productId: number) {
    return this.cmsRepo.findOne({ where: { product: { id: productId } } });
  }
}