import { CmsContentService } from './cms-content.service';
import { CreateCmsContentDto } from './dto/create-cms-content.dto';
import { UpdateCmsContentDto } from './dto/update-cms-content.dto';
export declare class CmsContentController {
    private readonly cmsService;
    constructor(cmsService: CmsContentService);
    getCmsContent(productId: number): Promise<import("./cms-content.entity").CmsContent>;
    createCmsContent(productId: number, dto: CreateCmsContentDto): Promise<import("./cms-content.entity").CmsContent>;
    updateCmsContent(productId: number, dto: UpdateCmsContentDto): Promise<import("./cms-content.entity").CmsContent>;
}
