import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsString, IsOptional } from 'class-validator';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  delivery_Id: number;

  @IsNotEmpty()
  @IsNumber()
  coupon_id: number;

  @IsNotEmpty()
  @IsString()
  payment_type: string;

  @IsNotEmpty()
  @IsNumber()
  total_price: number;

  @IsNotEmpty()
  @IsString()
  shipping_address: string;

  @IsOptional()
  @IsString()
  payment_status?: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsOptional()
  @IsString()
  productStatus?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  items: OrderItemDto[];
}
