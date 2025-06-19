import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    ord?: number;

    @IsNotEmpty()
    @IsNumber()
    product?: { id: number };
}