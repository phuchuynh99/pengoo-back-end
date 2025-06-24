import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { Admin } from '../admins/admin.entity';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
    @InjectRepository(RolePermission) private rolePermRepo: Repository<RolePermission>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}

  // 1. List all roles with permissions
  @Get()
  @Permissions('view_roles')
  async findAll() {
    const roles = await this.roleRepo.find({ relations: ['rolePermissions', 'rolePermissions.permission'] });
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      permissions: {
        edit: role.rolePermissions.some(rp => rp.permission.name === 'edit'),
        delete: role.rolePermissions.some(rp => rp.permission.name === 'delete'),
        update: role.rolePermissions.some(rp => rp.permission.name === 'update'),
      },
    }));
  }

  // 2. Update a role's permissions (edit, delete, update)
  @Patch(':id/permissions')
  @Permissions('edit_roles')
  async updatePermissions(
    @Param('id') id: number,
    @Body() perms: { edit: boolean; delete: boolean; update: boolean }
  ) {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['rolePermissions', 'rolePermissions.permission'] });
    if (!role) throw new Error('Role not found');

    // All possible permissions for this UI
    const allPerms = ['edit', 'delete', 'update'];

    // Remove permissions not in the new set
    for (const permName of allPerms) {
      const hasPerm = perms[permName as keyof typeof perms];
      const rp = role.rolePermissions.find(rp => rp.permission.name === permName);
      if (rp && !hasPerm) {
        await this.rolePermRepo.delete(rp.id);
      }
      if (!rp && hasPerm) {
        const perm = await this.permRepo.findOne({ where: { name: permName } });
        if (perm) {
          await this.rolePermRepo.save(this.rolePermRepo.create({ role, permission: perm }));
        }
      }
    }
    return { message: 'Permissions updated' };
  }

  // 3. List all users by role
  @Get(':roleName/users')
  @Permissions('view_roles')
  async getUsersByRole(@Param('roleName') roleName: string) {
    const users = await this.adminRepo.find({ relations: ['role'] });
    return users.filter(u => u.role?.name === roleName);
  }

  // 4. Assign a user to a role
  @Patch('assign-user')
  @Permissions('edit_roles')
  async assignUserToRole(
    @Body() body: { userId: number; roleName: string }
  ) {
    const user = await this.adminRepo.findOne({ where: { id: body.userId }, relations: ['role'] });
    const role = await this.roleRepo.findOne({ where: { name: body.roleName } });
    if (!user || !role) throw new Error('User or Role not found');
    user.role = role;
    await this.adminRepo.save(user);
    return { message: 'User assigned to role' };
  }

  // 5. Remove a user from a role (set to "User" or null)
  @Patch('remove-user')
  @Permissions('edit_roles')
  async removeUserFromRole(
    @Body() body: { userId: number }
  ) {
    const user = await this.adminRepo.findOne({ where: { id: body.userId }, relations: ['role'] });
    if (!user) throw new Error('User not found');
    user.role = null; // <-- fix: use null, not undefined
    await this.adminRepo.save(user);
    return { message: 'User removed from role' };
  }
}