import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post('register')
  // Registration is public, so skip guards
  @UseGuards()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('Admin', 'Editor')
  async getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Editor', 'Viewer')
  async getById(@Param('id') id: number) {
    return this.usersService.findById(Number(id));
  }

  @Patch(':id')
  @Roles('Admin', 'Editor')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')
  async remove(@Param('id') id: number) {
    await this.usersService.remove(Number(id));
    return { message: 'User deleted' };
  }

  @Patch(':id/status')
  @Roles('Admin', 'Editor')
  async setStatus(@Param('id') id: number, @Body('status') status: boolean) {
    return this.usersService.setStatus(Number(id), status);
  }

  @Patch(':id/reset-password')
  @Roles('Admin')
  async adminResetPassword(
    @Param('id') id: number,
    @Body('newPassword') newPassword: string
  ) {
    return this.usersService.adminResetPassword(Number(id), newPassword);
  }

  @Patch(':id/role')
  @Roles('Admin')
  async updateRole(
    @Param('id') id: number,
    @Body('role') role: string
  ) {
    return this.usersService.updateRole(Number(id), role);
  }
}