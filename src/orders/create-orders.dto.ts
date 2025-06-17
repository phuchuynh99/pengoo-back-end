import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod } from '../services/payment/payment.types';

class CreateOrderDetailDto {
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
  delivery_id: number;

  @IsNotEmpty()
  @IsNumber()
  coupon_id: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_type: PaymentMethod;

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

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  details: CreateOrderDetailDto[];
}
