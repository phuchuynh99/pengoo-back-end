import { ApiProperty } from "@nestjs/swagger";

export class VerifyRequestDto {
    @ApiProperty()
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}