import { Controller, Post, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCoupon } from './user-coupon.entity';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiBody, ApiQuery, ApiOperation } from '@nestjs/swagger';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    @InjectRepository(UserCoupon)
    private userCouponRepo: Repository<UserCoupon>,
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiBody({
    type: CreateCouponDto,
    examples: {
      default: {
        summary: 'Create coupon',
        value: {
          code: 'SUMMER2025',
          minOrderValue: 100000,
          maxOrderValue: 1000000,
          startDate: '2025-06-01',
          endDate: '2025-07-01',
          usageLimit: 100,
          discountPercent: 10,
          status: 'active',
          productIds: [1, 2],
          userIds: [3, 4],
        },
      },
    },
  })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Post('validate')
  @Public()
  @ApiOperation({ summary: 'Validate and apply a coupon to an order' })
  @ApiBody({
    schema: {
      example: {
        code: 'SUMMER2025',
        orderValue: 200000,
        userId: 3,
        productIds: [1, 2],
      },
    },
    description: 'Validate a coupon code for a user and order value',
  })
  validate(@Body() body: { code: string; orderValue: number; userId: number; productIds: number[] }) {
    return this.couponsService.validateAndApply(body.code, body.orderValue, body.userId, body.productIds);
  }

  @Get('redeem')
  @Public()
  @ApiOperation({ summary: 'Redeem a coupon using a token' })
  @ApiQuery({
    name: 'token',
    type: String,
    example: 'abc123token',
    description: 'Redemption token sent to user',
    required: true,
  })
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