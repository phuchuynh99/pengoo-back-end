import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { SignInResponseDto } from '../dto/signin-response.dto';
import { TokenPayloadDto } from 'src/dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(validatedUser: User, pass: string) {
    const isPasswordMatched = await bcrypt.compare(pass, validatedUser.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Wrong username or password');
    }
  }

  async signin(email: string, password: string): Promise<SignInResponseDto> {
    // Debug log: show input email and password (do not log password in production)
    console.log('[AuthService] Attempting login for email:', email);

    const user = await this.usersService.findByEmail(email);
    console.log('[AuthService] User found:', user);

    if (!user) {
      console.log('[AuthService] User not found for email:', email);
      throw new UnauthorizedException('User not found');
    }

    await this.validateUser(user, password);

    const payload: TokenPayloadDto = { 
      email: user.email, 
      sub: user.id, 
      role: user.role, 
      username: user.username 
    };

    const token = this.signToken(payload);

    console.log('[AuthService] Login successful for user:', user.username, 'Token:', token);

    return new SignInResponseDto(token, user.username, user.role);
  }

  async verify(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  signToken(payload: TokenPayloadDto): string {
    return this.jwtService.sign(payload);
  }
}