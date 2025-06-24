import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../roles/role-permission.entity';
import { Permission } from '../roles/permission.entity';
import { Role } from '../roles/role.entity';
import { PermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    NotificationsModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([RolePermission, Permission, Role]),
  ],
  providers: [AuthService, JwtStrategy, PermissionsGuard],
  exports: [AuthService, PermissionsGuard],
  controllers: [AuthController],
})
export class AuthModule {}