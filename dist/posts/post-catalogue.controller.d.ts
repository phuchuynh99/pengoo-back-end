import { Repository } from 'typeorm';
import { PostCatalogue } from './post-catalogue.entity';
import { CreatePostCatalogueDto } from './dto/create-post-catalogue.dto';
import { UpdatePostCatalogueDto } from './dto/update-post-catalogue.dto';
export declare class PostCatalogueController {
    private readonly repo;
    constructor(repo: Repository<PostCatalogue>);
    findAll(): Promise<PostCatalogue[]>;
    create(dto: CreatePostCatalogueDto): Promise<PostCatalogue>;
    update(id: number, dto: UpdatePostCatalogueDto): Promise<PostCatalogue | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
