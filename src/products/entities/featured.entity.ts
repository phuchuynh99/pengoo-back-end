// src/products/entities/feature.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../product.entity';

@Entity('featured')
export class Featured {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(() => Product, (product) => product.featured, { onDelete: 'CASCADE' })
    product: Product;
}
