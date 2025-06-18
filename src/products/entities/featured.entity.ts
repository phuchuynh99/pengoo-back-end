// src/products/entities/feature.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class Featured {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => Product, (product) => product.featured)
  product: Product;
}
