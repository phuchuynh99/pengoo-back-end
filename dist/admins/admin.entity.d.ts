import { Role } from '../roles/role.entity';
export declare class Admin {
    id: number;
    name: string;
    canonical: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    bio: string;
    birthday: Date;
    publish: boolean;
    created_at: Date;
    updated_at: Date;
    role: Role | null;
}
