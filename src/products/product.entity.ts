import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Review } from 'src/reviews/review.entity';
import { Wishlist } from 'src/wishlist/wishlist.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  product_name: string;

  @Column('text', { nullable: false })
  description: string;

  @Column('decimal', { nullable: false })
  product_price: number;

  @Column({ nullable: false })
  slug: string;


  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  image_url: string;

  @Column({ nullable: false })
  discount: number;

  @Column({ nullable: false })
  meta_title: string;

  @Column({ nullable: false })
  meta_description: string;

  @Column({ nullable: false })
  quantity_sold: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
  @ManyToOne(() => Publisher, (publisher) => publisher.products)
  publisher: Publisher;


  // @OneToMany(() => Review, (review) => review.product)
  // reviews: Review[];

  // @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  // wishlists: Wishlist[];

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
