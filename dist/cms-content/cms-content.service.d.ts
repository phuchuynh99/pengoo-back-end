import { Repository } from 'typeorm';
import { CmsContent } from './cms-content.entity';
import { Product } from '../products/product.entity';
import { CreateCmsContentDto } from './dto/create-cms-content.dto';
import { UpdateCmsContentDto } from './dto/update-cms-content.dto';
export declare class CmsContentService {
    private cmsRepo;
    private productRepo;
    constructor(cmsRepo: Repository<CmsContent>, productRepo: Repository<Product>);
    create(productId: number, dto: CreateCmsContentDto): Promise<CmsContent>;
    update(productId: number, dto: UpdateCmsContentDto): Promise<CmsContent>;
    findByProduct(productId: number): Promise<CmsContent | null>;
}
