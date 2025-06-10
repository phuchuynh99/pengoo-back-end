import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @ManyToOne(() => User, user => user.id, { nullable: false })
  user: User; // User

  @Column({ type: 'int', nullable: false })
  delivery_id: number; // Delivery ID

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
  payment_status: string; // Payment status

  @Column({ type: 'varchar', nullable: true })
  discount: string; // Discount code

  @Column({ type: 'varchar', nullable: true })
  productStatus: string; // Product availability status

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Product, product => product.id)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;
}
