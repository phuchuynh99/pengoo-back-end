import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Table } from 'typeorm';
import { Category } from './category.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column('text', { nullable: false })
  description: string;

  @Column('decimal', { nullable: false })
  price: number;

  @Column({ nullable: false })
  sku: string;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;
}
