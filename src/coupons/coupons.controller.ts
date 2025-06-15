import { Controller, Post, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Post('validate')
  validate(@Body() body: { code: string; orderValue: number; userId: number; productIds: number[] }) {
    return this.couponsService.validateAndApply(body.code, body.orderValue, body.userId, body.productIds);
  }
}