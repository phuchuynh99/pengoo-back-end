import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@Req() req: Request) {
  //   return req.user;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put('profile')
  // async updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   await this.usersService.update(id, updateUserDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete('profile')
  // async deleteProfile(@Req() req: Request) {
  //   const user = req.user;
  //   await this.usersService.remove(user.id);
  // }
}