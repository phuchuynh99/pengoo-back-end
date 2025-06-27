import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { Coupon, CouponStatus } from './coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UserCoupon } from './user-coupon.entity';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
    @InjectRepository(UserCoupon)
    private userCouponRepo: Repository<UserCoupon>,
  ) { }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponsRepository.create(dto);

    return this.couponsRepository.save(coupon);
  }

  async validateAndApply(code: string, orderValue: number, userId: number, productIds: number[]): Promise<{ coupon: Coupon, discount: number }> {
    const coupon = await this.couponsRepository.findOne({
      where: { code },
      // relations: ['products', 'users'],
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const now = new Date();
    if (coupon.status !== CouponStatus.Active) throw new BadRequestException('Coupon is not active');
    // if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) throw new BadRequestException('Coupon is not valid at this time');
    if (orderValue < Number(coupon.minOrderValue) || orderValue > Number(coupon.maxOrderValue)) throw new BadRequestException('Order value not eligible for this coupon');
    if (coupon.usedCount >= coupon.usageLimit) throw new BadRequestException('Coupon usage limit reached');

    // If coupon is restricted to certain users
    //     if (coupon.users && coupon.users.length > 0 && !coupon.users.some(u => u.id === userId)) {
    //       throw new BadRequestException('Coupon not valid for this user');
    //     }

    // If coupon is restricted to certain products
    // if (coupon.products && coupon.products.length > 0 && !coupon.products.some(p => productIds.includes(p.id))) {
    //   throw new BadRequestException('Coupon not valid for these products');
    // }


    // Calculate discount
    const discount = (orderValue * Number(coupon.discountPercent)) / 100;

    // Mark as used
    coupon.usedCount += 1;
    if (coupon.usedCount >= coupon.usageLimit) {
      coupon.status = CouponStatus.Inactive;
    }
    await this.couponsRepository.save(coupon);

    return { coupon, discount };
  }

  public async findActiveCoupon(): Promise<Coupon | undefined> {
    const coupon = await this.couponsRepository.findOne({
      where: { status: CouponStatus.Active },
      // relations: ['users'],
      order: { id: 'ASC' },
    });
    return coupon ?? undefined;
  }
  public async getAll(): Promise<Coupon[] | undefined> {
    const coupon = await this.couponsRepository.find()
    return coupon ?? undefined;
  }


  async getNextAvailableCoupon(userId: number, userPoints: number): Promise<Coupon | null> {
    // Find the next coupon with milestonePoints > userPoints, ordered by milestonePoints ASC
    const nextCoupon = await this.couponsRepository.createQueryBuilder("coupon")
      .where("coupon.milestonePoints > :userPoints", { userPoints })
      .andWhere("coupon.status = :status", { status: CouponStatus.Active })
      .orderBy("coupon.milestonePoints", "ASC")
      .getOne();

    return nextCoupon ?? null;
  }

  async getMilestoneCoupons(): Promise<Coupon[]> {
    return this.couponsRepository.find({
      where: { milestonePoints: Not(IsNull()), status: CouponStatus.Active },
      order: { milestonePoints: 'ASC' },
    });
  }
  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOne({
      where: { id }
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    Object.assign(coupon, dto);


    return this.couponsRepository.save(coupon);
  }

  async updateStatus(id: number, status: CouponStatus): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    coupon.status = status;
    return this.couponsRepository.save(coupon);
  }
}