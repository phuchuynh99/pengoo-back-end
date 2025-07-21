"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./role.entity");
const permission_entity_1 = require("./permission.entity");
const role_permission_entity_1 = require("./role-permission.entity");
const admin_entity_1 = require("../admins/admin.entity");
const permissions_guard_1 = require("../auth/permissions.guard");
const permissions_decorator_1 = require("../auth/permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let RolesController = class RolesController {
    roleRepo;
    permRepo;
    rolePermRepo;
    adminRepo;
    constructor(roleRepo, permRepo, rolePermRepo, adminRepo) {
        this.roleRepo = roleRepo;
        this.permRepo = permRepo;
        this.rolePermRepo = rolePermRepo;
        this.adminRepo = adminRepo;
    }
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
    async updatePermissions(id, perms) {
        const role = await this.roleRepo.findOne({ where: { id }, relations: ['rolePermissions', 'rolePermissions.permission'] });
        if (!role)
            throw new Error('Role not found');
        const allPerms = ['edit', 'delete', 'update'];
        for (const permName of allPerms) {
            const hasPerm = perms[permName];
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
    async getUsersByRole(roleName) {
        const users = await this.adminRepo.find({ relations: ['role'] });
        return users.filter(u => u.role?.name === roleName);
    }
    async assignUserToRole(body) {
        const user = await this.adminRepo.findOne({ where: { id: body.userId }, relations: ['role'] });
        const role = await this.roleRepo.findOne({ where: { name: body.roleName } });
        if (!user || !role)
            throw new Error('User or Role not found');
        user.role = role;
        await this.adminRepo.save(user);
        return { message: 'User assigned to role' };
    }
    async removeUserFromRole(body) {
        const user = await this.adminRepo.findOne({ where: { id: body.userId }, relations: ['role'] });
        if (!user)
            throw new Error('User not found');
        user.role = null;
        await this.adminRepo.save(user);
        return { message: 'User removed from role' };
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('view_roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/permissions'),
    (0, permissions_decorator_1.Permissions)('edit_roles'),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                edit: true,
                delete: false,
                update: true,
            },
        },
        description: 'Set permissions for the role (edit, delete, update)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updatePermissions", null);
__decorate([
    (0, common_1.Get)(':roleName/users'),
    (0, permissions_decorator_1.Permissions)('view_roles'),
    (0, swagger_1.ApiParam)({ name: 'roleName', type: String, example: 'Admin' }),
    __param(0, (0, common_1.Param)('roleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Patch)('assign-user'),
    (0, permissions_decorator_1.Permissions)('edit_roles'),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                userId: 2,
                roleName: 'Editor',
            },
        },
        description: 'Assign a user to a role',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignUserToRole", null);
__decorate([
    (0, common_1.Patch)('remove-user'),
    (0, permissions_decorator_1.Permissions)('edit_roles'),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                userId: 2,
            },
        },
        description: 'Remove a user from their role',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "removeUserFromRole", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(3, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesController);
//# sourceMappingURL=roles.controller.js.map