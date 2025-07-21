import { RolePermission } from './role-permission.entity';
export declare class Permission {
    id: number;
    name: string;
    rolePermissions: RolePermission[];
}
