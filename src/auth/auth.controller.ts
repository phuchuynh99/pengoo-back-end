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
    if (!body.email) throw new BadRequestException('Email is required');
    if (!body.password) throw new BadRequestException('Password is required');
    // This will send the code to email if password is correct
    return this.authService.signinWithEmailMfa(body.email, body.password);
  }

  @Post('verify-mfa')
  @Public()
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        code: '123456'
      }
    }
  })
  async verifyMfa(@Body() body: { email: string; code: string }) {
    if (!body.email || !body.code) throw new BadRequestException('Email and code are required');
    return this.authService.verifyMfaCode(body.email, body.code);
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

  @Post('google')
  @Public()
  @ApiBody({
    schema: {
      example: { idToken: 'firebase-id-token' }
    }
  })
  async googleLogin(@Body('idToken') idToken: string) {
    if (!idToken) throw new BadRequestException('No idToken provided');
    return this.authService.googleLogin(idToken);
  }

  @Post('facebook')
  @Public()
  @ApiBody({
    schema: {
      example: { accessToken: 'facebook-access-token' }
    }
  })
  async facebookLogin(@Body('accessToken') accessToken: string) {
    if (!accessToken) throw new BadRequestException('No accessToken provided');
    return this.authService.facebookLogin(accessToken);
  }

  @Post('simple-login')
  @Public()
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'yourPassword123',
      },
    },
  })
  async simpleLogin(@Body() body: { email: string; password: string }) {
    if (!body.email) throw new BadRequestException('Email is required');
    if (!body.password) throw new BadRequestException('Password is required');
    // This will NOT send MFA code, just validate and return token
    return this.authService.signin(body.email, body.password);
  }
}