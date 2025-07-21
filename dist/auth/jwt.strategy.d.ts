import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadDto } from '../dto/token-payload.dto';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private configService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(payload: TokenPayloadDto): Promise<import("../users/user.entity").User>;
}
export {};
