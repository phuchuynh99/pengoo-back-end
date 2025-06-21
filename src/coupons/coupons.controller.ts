import { Controller, Post, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCoupon } from './user-coupon.entity';
import { Public } from '../auth/public.decorator'; // Add this import

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    @InjectRepository(UserCoupon)
    private userCouponRepo: Repository<UserCoupon>,
  ) {}

  @Post()
  @Public()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Post('validate')
  @Public()
  validate(@Body() body: { code: string; orderValue: number; userId: number; productIds: number[] }) {
    return this.couponsService.validateAndApply(body.code, body.orderValue, body.userId, body.productIds);
  }

  @Get('redeem')
  @Public()
  async redeemCoupon(@Query('token') token: string) {
    const userCoupon = await this.userCouponRepo.findOne({ where: { redeemToken: token }, relations: ['coupon', 'user'] });
    if (!userCoupon) throw new BadRequestException('Invalid or expired token');
    if (userCoupon.redeemed) throw new BadRequestException('Coupon already redeemed');

    userCoupon.redeemed = true;
    userCoupon.redeemedAt = new Date();
    await this.userCouponRepo.save(userCoupon);

    return { message: 'Coupon redeemed! You can now use it.', coupon: userCoupon.coupon.code };
  }
}