import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { Admin } from '../admins/admin.entity';
export declare class RolesController {
    private roleRepo;
    private permRepo;
    private rolePermRepo;
    private adminRepo;
    constructor(roleRepo: Repository<Role>, permRepo: Repository<Permission>, rolePermRepo: Repository<RolePermission>, adminRepo: Repository<Admin>);
    findAll(): Promise<{
        id: number;
        name: string;
        permissions: {
            edit: boolean;
            delete: boolean;
            update: boolean;
        };
    }[]>;
    updatePermissions(id: number, perms: {
        edit: boolean;
        delete: boolean;
        update: boolean;
    }): Promise<{
        message: string;
    }>;
    getUsersByRole(roleName: string): Promise<Admin[]>;
    assignUserToRole(body: {
        userId: number;
        roleName: string;
    }): Promise<{
        message: string;
    }>;
    removeUserFromRole(body: {
        userId: number;
    }): Promise<{
        message: string;
    }>;
}
