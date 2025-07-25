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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const signin_response_dto_1 = require("../dto/signin-response.dto");
const admin = require("firebase-admin");
const notifications_service_1 = require("../notifications/notifications.service");
const node_fetch_1 = require("node-fetch");
let AuthService = class AuthService {
    usersService;
    jwtService;
    notificationsService;
    constructor(usersService, jwtService, notificationsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async validateUser(validatedUser, pass) {
        const isPasswordMatched = await bcrypt.compare(pass, validatedUser.password);
        if (!isPasswordMatched) {
            throw new common_1.UnauthorizedException('Wrong username or password');
        }
    }
    async signin(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        await this.validateUser(user, password);
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            username: user.username
        };
        const token = this.signToken(payload);
        return new signin_response_dto_1.SignInResponseDto(token, user.username, user.role);
    }
    async verify(token) {
        try {
            const decoded = await this.jwtService.verify(token);
            console.log(decoded);
            return decoded;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async googleLogin(idToken, skipMfa = false) {
        try {
            if (!admin.apps.length) {
                const projectId = process.env.FIREBASE_PROJECT_ID;
                const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
                const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
                if (!projectId || !clientEmail || !privateKey) {
                    throw new common_1.InternalServerErrorException('Missing Firebase Admin credentials');
                }
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
            }
            const decoded = await admin.auth().verifyIdToken(idToken);
            const { email, name, picture, uid } = decoded;
            if (!email) {
                throw new common_1.UnauthorizedException('Google account email is missing');
            }
            let user = await this.usersService.findByEmail(email);
            if (!user) {
                user = await this.usersService.create({
                    username: uid,
                    password: Math.random().toString(36).slice(-8),
                    full_name: name ?? email ?? '',
                    email: email,
                    avatar_url: picture ?? '',
                    phone_number: '',
                    address: '',
                    role: 'user',
                    provider: 'google',
                });
            }
            if (skipMfa) {
                const payload = {
                    email: user.email,
                    sub: user.id,
                    role: user.role,
                    username: user.username
                };
                const token = this.signToken(payload);
                return { token, username: user.username, role: user.role, profileCompleted: !!user.full_name };
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            user.mfaCode = code;
            user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
            await this.usersService.update(user.id, user);
            await this.notificationsService.sendEmail(user.email, 'Pengoo - Your Login Confirmation Code', `Pengoo Login Verification

Hello ${user.full_name || user.email},

We received a request to sign in to your Pengoo account. Please use the code below to verify your login:

${code}

This code will expire in 5 minutes. If you did not request this, please ignore this email.

Pengoo Corporation
130/9 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City
Hotline: 0937314158
`);
            return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
    }
    async signinWithEmailMfa(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched)
            throw new common_1.UnauthorizedException('Wrong username or password');
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.mfaCode = code;
        user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
        await this.usersService.update(user.id, user);
        await this.notificationsService.sendEmail(user.email, 'Pengoo - Your Login Confirmation Code', `Pengoo Login Verification

Hello ${user.full_name || user.email},

We received a request to sign in to your Pengoo account. Please use the code below to verify your login:

${code}

This code will expire in 5 minutes. If you did not request this, please ignore this email.

Pengoo Corporation
130/9 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City
Hotline: 0937314158
`);
        return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
    }
    async verifyMfaCode(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (user &&
            user.mfaCode === code &&
            user.mfaCodeExpires &&
            user.mfaCodeExpires > new Date()) {
            user.mfaCode = null;
            user.mfaCodeExpires = null;
            await this.usersService.update(user.id, user);
            const payload = {
                email: user.email,
                sub: user.id,
                role: user.role,
                username: user.username
            };
            const token = this.signToken(payload);
            return { token, username: user.username, role: user.role };
        }
        throw new common_1.UnauthorizedException('Invalid or expired code');
    }
    signToken(payload) {
        return this.jwtService.sign(payload);
    }
    async facebookLogin(accessToken, skipMfa = false) {
        try {
            const fbRes = await (0, node_fetch_1.default)(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
            const fbData = await fbRes.json();
            if (!fbData.email) {
                throw new common_1.UnauthorizedException('Facebook account email is missing');
            }
            let user = await this.usersService.findByEmail(fbData.email);
            if (!user) {
                user = await this.usersService.create({
                    username: fbData.id,
                    password: Math.random().toString(36).slice(-8),
                    full_name: fbData.name ?? fbData.email ?? '',
                    email: fbData.email,
                    avatar_url: fbData.picture?.data?.url ?? '',
                    phone_number: '',
                    address: '',
                    role: 'USER',
                });
            }
            if (skipMfa) {
                const payload = {
                    email: user.email,
                    sub: user.id,
                    role: user.role,
                    username: user.username
                };
                const token = this.signToken(payload);
                return { token, username: user.username, role: user.role, profileCompleted: !!user.full_name };
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            user.mfaCode = code;
            user.mfaCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
            await this.usersService.update(user.id, user);
            await this.notificationsService.sendEmail(user.email, 'Pengoo - Your Login Confirmation Code', `Pengoo Login Verification

Hello ${user.full_name || user.email},

We received a request to sign in to your Pengoo account. Please use the code below to verify your login:

${code}

This code will expire in 5 minutes. If you did not request this, please ignore this email.

Pengoo Corporation
130/9 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City
Hotline: 0937314158
`);
            return { mfaRequired: true, message: 'Check your email for the confirmation code.' };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Facebook token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map