import { Controller, Post, Body, Get, Query, BadRequestException, Patch, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCoupon } from './user-coupon.entity';
import { Public } from '../auth/public.decorator'; // Add this import
import { ApiBody } from '@nestjs/swagger';
import { UpdateCouponDto, UpdateCouponStatusDto } from './dto/update-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    @InjectRepository(UserCoupon)
    private userCouponRepo: Repository<UserCoupon>,
  ) { }

  @Post()
  @Public()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Post('validate')
  @ApiBody({
    type: CreateCouponDto,
    examples: {
      default: {
        summary: 'Example product',
        value: {
          code: "HUYDEPTRAI",
          orderValue: 1000,
          userId: 1,
          product: [1, 2]
        }
      }
    }
  })
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
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(+id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() dto: UpdateCouponStatusDto) {
    return this.couponsService.updateStatus(+id, dto.status);
  }
}