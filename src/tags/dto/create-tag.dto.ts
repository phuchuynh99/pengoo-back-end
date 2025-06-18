import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    type: string;
}
