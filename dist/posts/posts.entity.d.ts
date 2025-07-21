import { PostCatalogue } from './post-catalogue.entity';
export declare class Post {
    id: number;
    name: string;
    canonical: string;
    description: string;
    content: string;
    meta_description: string;
    meta_keyword: string;
    meta_title: string;
    image: string;
    order: number;
    publish: boolean;
    created_at: Date;
    updated_at: Date;
    catalogue: PostCatalogue;
    textColor?: string;
    bgColor?: string;
    fontFamily?: string;
    fontSize?: string;
}
