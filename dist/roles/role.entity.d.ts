import { Admin } from '../admins/admin.entity';
import { RolePermission } from './role-permission.entity';
export declare class Role {
    id: number;
    name: string;
    canonical: string;
    publish: boolean;
    created_at: Date;
    updated_at: Date;
    admins: Admin[];
    rolePermissions: RolePermission[];
}
