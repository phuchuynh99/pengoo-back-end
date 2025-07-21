import { Admin } from '../admins/admin.entity';
export declare class PostCatalogue {
    id: number;
    name: string;
    canonical: string;
    description: string;
    meta_description: string;
    meta_keyword: string;
    meta_title: string;
    image: string;
    order: number;
    publish: boolean;
    created_at: Date;
    updated_at: Date;
    admin: Admin;
}
