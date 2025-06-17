import { Body, Controller, Post, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from 'src/dto/signin-request.dto';
import { VerifyRequestDto } from 'src/dto/verify-request.dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('signin')
  async signin(@Body() body: SignInRequestDto) {
    return this.authService.signin(body.username, body.password);
  }

  @Post('verify')
  async verify(@Body() body: VerifyRequestDto) {
    try {
      const decoded = await this.authService.verify(body.token);
      return { isValid: true, decoded };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.usersService.setResetToken(email);
    if (user) {
      await this.notificationsService.sendPasswordReset(user.email, user.resetPasswordToken!);
    }
    // Always return success to prevent email enumeration
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const success = await this.usersService.resetPassword(body.token, body.newPassword);
    if (!success) throw new BadRequestException('Invalid or expired token');
    return { message: 'Password has been reset successfully.' };
  }
}
