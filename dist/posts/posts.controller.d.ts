import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(dto: CreatePostDto): Promise<import("./posts.entity").Post>;
    findAll(): Promise<import("./posts.entity").Post[]>;
    findOne(id: number): Promise<import("./posts.entity").Post>;
    findByCanonical(canonical: string): Promise<import("./posts.entity").Post | null>;
    update(id: number, dto: UpdatePostDto): Promise<import("./posts.entity").Post>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getPostBySlug(slug: string): Promise<import("./posts.entity").Post>;
}
