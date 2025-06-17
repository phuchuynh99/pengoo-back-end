import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Delivery } from '../delivery/delivery.entity';
import { Review } from '../reviews/review.entity';

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  PendingOnDelivery = 'pending_on_delivery',
  Refunded = 'refunded',
}

export enum ProductStatus {
  Pending = 'pending',
  Cancelled = 'cancelled',
  Shipped = 'shipped',
  Delivered = 'delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @ManyToOne(() => User, user => user.id, { nullable: false })
  user: User; // User

  @ManyToOne(() => Delivery, { nullable: false })
  @JoinColumn({ name: 'delivery_id' }) // This will use delivery_id as the foreign key
  delivery: Delivery; // Delivery method

  @Column({ type: 'int', nullable: false })
  coupon_id: number; // Coupon ID

  @Column({ type: 'varchar', nullable: false })
  payment_type: string; // Payment method

  @CreateDateColumn({ type: 'date', nullable: false })
  order_date: Date; // Order date

  @Column({ type: 'int', nullable: false })
  total_price: number; // Total price

  @Column({ type: 'varchar', nullable: false })
  shipping_address: string; // Shipping address

  @Column({ type: 'varchar', nullable: true })
  payment_status: PaymentStatus; // Payment status

  @Column({ type: 'varchar', nullable: true })
  discount: string; // Discount code

  @Column({ type: 'varchar', nullable: true })
  productStatus: string; // Product availability status

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order, { cascade: true })
  details: OrderDetail[];

  @OneToMany(() => Review, review => review.order)
  reviews: Review[];
}

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.details)
  order: Order;

  @ManyToOne(() => Product, product => product.id)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number; // price per unit at the time of order

  // Optional: computed getter for total price of this item
  get total(): number {
    return Number(this.price) * this.quantity;
  }
}
