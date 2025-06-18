import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  featured: string;

  @IsNotEmpty()
  @IsNumber()
  product_price: number;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsString()
  meta_title: string;

  @IsNotEmpty()
  @IsString()
  meta_description: string;

  @IsNotEmpty()
  @IsString()
  mainImage: string;

  @IsNotEmpty()
  @IsString()
  detailImages: string;

  @IsNotEmpty()
  @IsNumber()
  quantity_sold: number;

  @IsNotEmpty()
  @IsNumber()
  quantity_stock: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  publisherID: number;

  @IsNotEmpty()
  @IsNumber()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  tags?: string[] | string;
}
