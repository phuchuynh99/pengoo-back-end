// src/products/entities/feature.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../product.entity';

@Entity('feature')
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(() => Product, (product) => product.features, { onDelete: 'CASCADE' })
    product: Product;
}
