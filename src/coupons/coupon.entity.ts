import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

export enum CouponStatus {
  Active = 'active',
  Inactive = 'inactive',
  Expired = 'expired',
}

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal')
  minOrderValue: number;

  @Column('decimal')
  maxOrderValue: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('int')
  usageLimit: number;

  @Column('int', { default: 0 })
  usedCount: number;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.Active })
  status: CouponStatus;

  @Column('decimal')
  discountPercent: number; // Percentage discount (e.g., 10 for 10%)

  // Optional: restrict coupon to specific products
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  // Optional: restrict coupon to specific users
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}