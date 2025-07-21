import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermission } from '../roles/role-permission.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private rolePermissionRepo;
    private roleRepo;
    constructor(reflector: Reflector, rolePermissionRepo: Repository<RolePermission>, roleRepo: Repository<Role>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
