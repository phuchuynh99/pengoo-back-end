import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    folder?: string;

    @IsOptional()
    @IsNumber()
    ord?: number;

    @IsOptional()
    product?: { id: number };
}