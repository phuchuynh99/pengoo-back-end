import { CouponStatus } from '../coupon.entity';
export declare class CreateCouponDto {
    code: string;
    minOrderValue: number;
    maxOrderValue: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    discountPercent: number;
    status: CouponStatus;
    productIds?: number[];
    userIds?: number[];
}
