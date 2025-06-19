import { Body, Controller, Post, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { SignInRequestDto } from 'src/dto/signin-request.dto';
import { VerifyRequestDto } from 'src/dto/verify-request.dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Public } from './public.decorator';

@Controller('api/auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('signin')
  @Public()
  @ApiBody({
    type: SignInRequestDto,
    examples: {
      default: {
        summary: 'Sign in with email and password',
        value: {
          email: 'user@example.com',
          password: 'yourPassword123',
        },
      },
    },
  })
  async signin(@Body() body: SignInRequestDto) {
    if (body.email) {
      return this.authService.signin(body.email, body.password);
    } else {
      throw new BadRequestException('Email is required');
    }
  }

  @Post('verify')
  @Public()
  @ApiBody({
    type: VerifyRequestDto,
    examples: {
      default: {
        summary: 'Verify JWT token',
        value: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async verify(@Body() body: VerifyRequestDto) {
    try {
      const decoded = await this.authService.verify(body.token);
      return { isValid: true, decoded };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('forgot-password')
  @Public()
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    const user = await this.usersService.setResetToken(email);
    if (user) {
      await this.notificationsService.sendPasswordReset(user.email, user.resetPasswordToken!);
    }
    // Always return success to prevent email enumeration
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  @Post('reset-password')
  @Public()
  @ApiBody({
    schema: {
      example: {
        token: 'reset-token-from-email',
        newPassword: 'newSecurePassword123',
      },
    },
  })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const success = await this.usersService.resetPassword(body.token, body.newPassword);
    if (!success) throw new BadRequestException('Invalid or expired token');
    return { message: 'Password has been reset successfully.' };
  }
}