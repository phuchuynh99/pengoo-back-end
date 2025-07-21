import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
export declare class CollectionsController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    findAll(): Promise<import("./collection.entity").Collection[]>;
    create(dto: CreateCollectionDto): Promise<import("./collection.entity").Collection>;
    getOne(slug: string): Promise<import("./collection.entity").Collection | null>;
    update(id: number, dto: UpdateCollectionDto): Promise<import("./collection.entity").Collection | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
