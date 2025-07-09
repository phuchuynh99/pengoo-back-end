import { Injectable, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { SignInResponseDto } from '../dto/signin-response.dto';
import { TokenPayloadDto } from 'src/dto/token-payload.dto';
import * as admin from 'firebase-admin';
import { NotificationsService } from '../notifications/notifications.service';
import fetch from 'node-fetch'; // Add at the top if not present

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
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
      username: user.username,
      points: user.points || 0, 
    };

    const token = this.signToken(payload);

    console.log('[AuthService] Login successful for user:', user.username, 'Token:', token);

    return new SignInResponseDto(token, user.username, user.role);
  }

  async verify(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(token);
      console.log(decoded)
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async googleLogin(idToken: string) {
    try {
      // Initialize Firebase Admin if not already
      if (!admin.apps.length) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        if (!projectId || !clientEmail || !privateKey) {
          throw new InternalServerErrorException('Missing Firebase Admin credentials');
        }
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }

      // Verify token and get user info
      const decoded = await admin.auth().verifyIdToken(idToken);
      const { email, name, picture, uid } = decoded;

      if (!email) {
        throw new UnauthorizedException('Google account email is missing');
      }
      let user = await this.usersService.findByEmail(email!);
      if (!user) {
        // Register new user
        user = await this.usersService.create({
          username: uid,
          password: Math.random().toString(36).slice(-8), // random password
          full_name: name ?? email ?? '',
          email: email,
          avatar_url: picture ?? '',
          phone_number: '',
          address: '',
          role: 'USER',
        });
      }

      // --- MFA: Send code to email, require verification ---
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.mfaCode = code;
      user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
      await this.usersService.update(user.id, user);
      await this.notificationsService.sendEmail(
        user.email,
        'Your Login Confirmation Code',
        `Your code is: ${code}`
      );
      return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async signinWithEmailMfa(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new UnauthorizedException('Wrong username or password');

    // Generate code, save to user, send email
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.mfaCode = code;
    user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await this.usersService.update(user.id, user);
    await this.notificationsService.sendEmail(
      user.email,
      'Your Login Confirmation Code',
      `Your code is: ${code}`
    );
    return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
  }

  async verifyMfaCode(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.mfaCode === code &&
      user.mfaCodeExpires &&
      user.mfaCodeExpires > new Date()
    ) {
      // Clear code after use
      user.mfaCode = null;
      user.mfaCodeExpires = null;
      await this.usersService.update(user.id, user);
      // Issue JWT as usual
      const payload: TokenPayloadDto = {
        email: user.email,
        sub: user.id,
        role: user.role,
        username: user.username
      };
      const token = this.signToken(payload);
      return { token, username: user.username, role: user.role };
    }
    throw new UnauthorizedException('Invalid or expired code');
  }

  signToken(payload: TokenPayloadDto): string {
    return this.jwtService.sign(payload);
  }

  // async facebookLogin(accessToken: string) {
  //   try {
  //     // Get user info from Facebook Graph API
  //     const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
  //     const fbData = await fbRes.json();

  //     if (!fbData.email) {
  //       throw new UnauthorizedException('Facebook account email is missing');
  //     }

  //     let user = await this.usersService.findByEmail(fbData.email);
  //     if (!user) {
  //       user = await this.usersService.create({
  //         username: fbData.id,
  //         password: Math.random().toString(36).slice(-8),
  //         full_name: fbData.name ?? fbData.email ?? '',
  //         email: fbData.email,
  //         avatar_url: fbData.picture?.data?.url ?? '',
  //         phone_number: '',
  //         address: '',
  //         role: 'USER',
  //       });
  //     }

  //     // --- MFA: Send code to email, require verification ---
  //     const code = Math.floor(100000 + Math.random() * 900000).toString();
  //     user.mfaCode = code;
  //     user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
  //     await this.usersService.update(user.id, user);
  //     await this.notificationsService.sendEmail(
  //       user.email,
  //       'Your Login Confirmation Code',
  //       `Your code is: ${code}`
  //     );
  //     return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid Facebook token');
  //   }
  // }
}