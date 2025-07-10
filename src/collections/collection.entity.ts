import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}